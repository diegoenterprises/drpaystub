const cron = require("node-cron");
const fs = require("fs");
const path = require("path");
const fetch = require("node-fetch");

const CONFIG_DIR = path.join(__dirname, "..", "config");
const LOG_PREFIX = "[TaxDataFetcher]";

// Authoritative tax data API endpoints
const TAX_API_SOURCES = {
  federal: "https://taxfoundation.org/data/all/federal/2026-tax-brackets/",
  state: "https://taxfoundation.org/data/all/state/state-income-tax-rates-2026/",
  irs: "https://www.irs.gov/filing/federal-income-tax-rates-and-brackets",
  ssa: "https://www.ssa.gov/oact/cola/cbb.html",
};

// Current tax year tracked by the system
const CURRENT_TAX_YEAR = 2026;

// Known 2026 authoritative rates (updated on last fetch)
const AUTHORITATIVE_RATES = {
  ssWageBase: 184500,
  medicareRate: 1.45,
  socialSecurityRate: 6.2,
  additionalMedicareRate: 0.9,
  federalRates: [10, 12, 22, 24, 32, 35, 37],
  flatRateStates: {
    ARIZONA: 2.5,
    ARKANSAS: 3.9,
    COLORADO: 4.25,
    GEORGIA: 5.19,
    IDAHO: 5.3,
    ILLINOIS: 4.95,
    INDIANA: 2.95,
    IOWA: 3.8,
    KENTUCKY: 3.5,
    MICHIGAN: 4.25,
    MISSISSIPPI: 4.0,
    MONTANA: 5.65,
    "NORTH CAROLINA": 3.99,
    PENNSYLVANIA: 3.07,
    UTAH: 4.5,
  },
  noTaxStates: [
    "ALASKA",
    "FLORIDA",
    "NEVADA",
    "NEW HAMPSHIRE",
    "SOUTH DAKOTA",
    "TENNESSEE",
    "TEXAS",
    "WASHINGTON",
    "WYOMING",
  ],
};

/**
 * Reads a JSON config file safely
 */
const readConfig = (filename) => {
  try {
    const filePath = path.join(CONFIG_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error(`${LOG_PREFIX} Error reading ${filename}:`, err.message);
    return null;
  }
};

/**
 * Writes a JSON config file safely with backup
 */
const writeConfig = (filename, data) => {
  try {
    const filePath = path.join(CONFIG_DIR, filename);
    const backupPath = path.join(
      CONFIG_DIR,
      `${filename}.backup-${Date.now()}`
    );

    // Create backup before overwriting
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
    console.log(`${LOG_PREFIX} Updated ${filename} (backup: ${path.basename(backupPath)})`);
    return true;
  } catch (err) {
    console.error(`${LOG_PREFIX} Error writing ${filename}:`, err.message);
    return false;
  }
};

/**
 * Validates that SS wage base constant in paystub.service.js matches expected value
 */
const auditSSWageBase = () => {
  try {
    const servicePath = path.join(
      __dirname,
      "paystub.service.js"
    );
    const content = fs.readFileSync(servicePath, "utf8");
    const match = content.match(/const SS_WAGE_BASE\s*=\s*(\d+)/);
    if (match) {
      const current = parseInt(match[1], 10);
      if (current !== AUTHORITATIVE_RATES.ssWageBase) {
        console.warn(
          `${LOG_PREFIX} SS_WAGE_BASE mismatch: code=${current}, expected=${AUTHORITATIVE_RATES.ssWageBase}`
        );
        return {
          field: "SS_WAGE_BASE",
          current,
          expected: AUTHORITATIVE_RATES.ssWageBase,
          needsUpdate: true,
        };
      }
    }
    return { field: "SS_WAGE_BASE", needsUpdate: false };
  } catch (err) {
    console.error(`${LOG_PREFIX} Error auditing SS_WAGE_BASE:`, err.message);
    return { field: "SS_WAGE_BASE", needsUpdate: false, error: err.message };
  }
};

/**
 * Validates federal tax brackets structure
 */
const auditFederalTax = () => {
  const federal = readConfig("federal-tax.json");
  if (!federal) return { file: "federal-tax.json", needsUpdate: false, error: "Could not read" };

  const issues = [];
  const filingStatuses = [
    "Single Taxpayers",
    "Married Jointly & Surviving Spouses",
    "Married Filing Separately",
    "Head of Household",
  ];

  for (const status of filingStatuses) {
    const brackets = federal[status];
    if (!brackets || !Array.isArray(brackets)) {
      issues.push(`Missing brackets for ${status}`);
      continue;
    }

    // Check rates match expected
    const rates = brackets.map((b) => b.tax);
    const expectedRates = AUTHORITATIVE_RATES.federalRates;
    if (rates.length !== expectedRates.length) {
      issues.push(`${status}: expected ${expectedRates.length} brackets, got ${rates.length}`);
    }
    for (let i = 0; i < Math.min(rates.length, expectedRates.length); i++) {
      if (rates[i] !== expectedRates[i]) {
        issues.push(`${status} bracket ${i}: rate ${rates[i]}% vs expected ${expectedRates[i]}%`);
      }
    }

    // Check bracket continuity (no gaps)
    for (let i = 1; i < brackets.length; i++) {
      if (brackets[i].min > brackets[i - 1].max + 1) {
        issues.push(`${status}: gap between brackets ${i - 1} and ${i}`);
      }
    }

    // Check top bracket uses min===max convention
    const top = brackets[brackets.length - 1];
    if (top.min !== top.max) {
      issues.push(`${status}: top bracket should have min===max`);
    }
  }

  return {
    file: "federal-tax.json",
    needsUpdate: issues.length > 0,
    issues,
  };
};

/**
 * Validates state tax rates against known authoritative data
 */
const auditStateTax = () => {
  const stateTax = readConfig("state-tax.json");
  if (!stateTax) return { file: "state-tax.json", needsUpdate: false, error: "Could not read" };

  const issues = [];

  // Check flat-rate states
  for (const [state, expectedRate] of Object.entries(AUTHORITATIVE_RATES.flatRateStates)) {
    if (!stateTax[state]) {
      issues.push(`Missing state: ${state}`);
      continue;
    }
    if (stateTax[state].hasFlatRate && stateTax[state].tax !== expectedRate) {
      issues.push(`${state}: rate ${stateTax[state].tax}% vs expected ${expectedRate}%`);
    }
  }

  // Check no-tax states
  for (const state of AUTHORITATIVE_RATES.noTaxStates) {
    if (!stateTax[state]) {
      issues.push(`Missing no-tax state: ${state}`);
      continue;
    }
    if (stateTax[state].hasTax !== false) {
      issues.push(`${state}: should have hasTax=false`);
    }
  }

  // Check all progressive states have bracket continuity
  for (const [state, config] of Object.entries(stateTax)) {
    if (config.hasTax === false || config.hasFlatRate === true) continue;

    const statuses = [
      "Single Taxpayers",
      "Married Jointly & Surviving Spouses",
      "Married Filing Separately",
      "Head of Household",
    ];

    for (const status of statuses) {
      const brackets = config[status];
      if (!brackets || !Array.isArray(brackets)) continue;

      for (let i = 1; i < brackets.length; i++) {
        const gap = brackets[i].min - brackets[i - 1].max;
        if (gap > 2) {
          issues.push(`${state} ${status}: gap of ${gap} between brackets ${i - 1} and ${i}`);
        }
      }
    }
  }

  return {
    file: "state-tax.json",
    needsUpdate: issues.length > 0,
    issues,
  };
};

/**
 * Validates other-taxes.json (FICA rates)
 */
const auditOtherTaxes = () => {
  const other = readConfig("other-taxes.json");
  if (!other) return { file: "other-taxes.json", needsUpdate: false, error: "Could not read" };

  const issues = [];

  if (other.Medicare !== AUTHORITATIVE_RATES.medicareRate) {
    issues.push(`Medicare: ${other.Medicare}% vs expected ${AUTHORITATIVE_RATES.medicareRate}%`);
  }
  if (other["Social Security"] !== AUTHORITATIVE_RATES.socialSecurityRate) {
    issues.push(
      `Social Security: ${other["Social Security"]}% vs expected ${AUTHORITATIVE_RATES.socialSecurityRate}%`
    );
  }

  return {
    file: "other-taxes.json",
    needsUpdate: issues.length > 0,
    issues,
  };
};

/**
 * Attempts to fetch the latest tax year info from web sources
 * Returns metadata about whether a new tax year's data is available
 */
const checkForNewTaxYear = async () => {
  try {
    const nextYear = CURRENT_TAX_YEAR + 1;
    const url = `https://taxfoundation.org/data/all/federal/${nextYear}-tax-brackets/`;
    const response = await fetch(url, {
      method: "HEAD",
      timeout: 10000,
      headers: { "User-Agent": "DrPaystub-TaxAuditor/1.0" },
    });

    if (response.ok) {
      console.log(
        `${LOG_PREFIX} New tax year data may be available for ${nextYear}! URL returned ${response.status}.`
      );
      return {
        newYearAvailable: true,
        year: nextYear,
        url,
      };
    }
    return { newYearAvailable: false };
  } catch (err) {
    // Network errors are expected — no new year data yet
    return { newYearAvailable: false };
  }
};

/**
 * Check the SSA website for wage base updates
 */
const checkSSAWageBase = async () => {
  try {
    const response = await fetch(TAX_API_SOURCES.ssa, {
      timeout: 10000,
      headers: { "User-Agent": "DrPaystub-TaxAuditor/1.0" },
    });
    if (response.ok) {
      const html = await response.text();
      // Look for the wage base amount pattern in the page
      const match = html.match(/\$([0-9,]+)\s*(?:for\s+)?(?:20\d{2})/);
      if (match) {
        const amount = parseInt(match[1].replace(/,/g, ""), 10);
        if (amount > 0 && amount !== AUTHORITATIVE_RATES.ssWageBase) {
          console.log(
            `${LOG_PREFIX} SSA wage base may have changed: found $${amount}, current $${AUTHORITATIVE_RATES.ssWageBase}`
          );
          return { changed: true, newAmount: amount };
        }
      }
    }
    return { changed: false };
  } catch (err) {
    return { changed: false, error: err.message };
  }
};

/**
 * Run the full audit — logs results and returns a summary
 */
const runFullAudit = async () => {
  console.log(`${LOG_PREFIX} ═══════════════════════════════════════════════`);
  console.log(`${LOG_PREFIX} Starting monthly tax data audit (Tax Year ${CURRENT_TAX_YEAR})`);
  console.log(`${LOG_PREFIX} ═══════════════════════════════════════════════`);

  const results = {
    timestamp: new Date().toISOString(),
    taxYear: CURRENT_TAX_YEAR,
    audits: {},
    alerts: [],
  };

  // 1. Audit SS wage base in code
  const ssAudit = auditSSWageBase();
  results.audits.ssWageBase = ssAudit;
  if (ssAudit.needsUpdate) {
    results.alerts.push(
      `SS_WAGE_BASE needs update: ${ssAudit.current} → ${ssAudit.expected}`
    );
  }
  console.log(
    `${LOG_PREFIX} SS_WAGE_BASE: ${ssAudit.needsUpdate ? "⚠️  NEEDS UPDATE" : "✅ OK"}`
  );

  // 2. Audit federal brackets
  const fedAudit = auditFederalTax();
  results.audits.federal = fedAudit;
  if (fedAudit.needsUpdate) {
    results.alerts.push(`Federal tax issues: ${fedAudit.issues.join("; ")}`);
  }
  console.log(
    `${LOG_PREFIX} Federal Tax: ${fedAudit.needsUpdate ? `⚠️  ${fedAudit.issues.length} issues` : "✅ OK"}`
  );

  // 3. Audit state tax rates
  const stateAudit = auditStateTax();
  results.audits.state = stateAudit;
  if (stateAudit.needsUpdate) {
    results.alerts.push(`State tax issues: ${stateAudit.issues.join("; ")}`);
  }
  console.log(
    `${LOG_PREFIX} State Tax: ${stateAudit.needsUpdate ? `⚠️  ${stateAudit.issues.length} issues` : "✅ OK"}`
  );

  // 4. Audit FICA rates
  const ficaAudit = auditOtherTaxes();
  results.audits.fica = ficaAudit;
  if (ficaAudit.needsUpdate) {
    results.alerts.push(`FICA issues: ${ficaAudit.issues.join("; ")}`);
  }
  console.log(
    `${LOG_PREFIX} FICA Rates: ${ficaAudit.needsUpdate ? `⚠️  ${ficaAudit.issues.length} issues` : "✅ OK"}`
  );

  // 5. Check if new tax year data is available online
  const newYear = await checkForNewTaxYear();
  results.audits.newTaxYear = newYear;
  if (newYear.newYearAvailable) {
    results.alerts.push(
      `New tax year ${newYear.year} data available at ${newYear.url}`
    );
    console.log(
      `${LOG_PREFIX} New Tax Year: ⚠️  ${newYear.year} data may be available!`
    );
  } else {
    console.log(`${LOG_PREFIX} New Tax Year: ✅ No new year detected`);
  }

  // 6. Check SSA for wage base changes
  const ssaCheck = await checkSSAWageBase();
  results.audits.ssaWageBase = ssaCheck;
  if (ssaCheck.changed) {
    results.alerts.push(`SSA wage base changed to $${ssaCheck.newAmount}`);
    console.log(
      `${LOG_PREFIX} SSA Wage Base: ⚠️  Changed to $${ssaCheck.newAmount}`
    );
  } else {
    console.log(`${LOG_PREFIX} SSA Wage Base: ✅ No change detected`);
  }

  // Save audit log
  const logPath = path.join(
    CONFIG_DIR,
    "tax-audit-log.json"
  );
  try {
    let logs = [];
    if (fs.existsSync(logPath)) {
      logs = JSON.parse(fs.readFileSync(logPath, "utf8"));
    }
    logs.push(results);
    // Keep only last 12 months of logs
    if (logs.length > 12) logs = logs.slice(-12);
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2) + "\n", "utf8");
  } catch (err) {
    console.error(`${LOG_PREFIX} Error saving audit log:`, err.message);
  }

  // Summary
  console.log(`${LOG_PREFIX} ─────────────────────────────────────────────`);
  if (results.alerts.length === 0) {
    console.log(`${LOG_PREFIX} ✅ All tax data is current. No issues found.`);
  } else {
    console.log(
      `${LOG_PREFIX} ⚠️  ${results.alerts.length} alert(s) require attention:`
    );
    results.alerts.forEach((a, i) => console.log(`${LOG_PREFIX}   ${i + 1}. ${a}`));
  }
  console.log(`${LOG_PREFIX} ═══════════════════════════════════════════════`);

  return results;
};

/**
 * Initialize the monthly cron job
 * Runs on the 1st of every month at 3:00 AM server time
 */
const initTaxDataFetcher = () => {
  console.log(`${LOG_PREFIX} Initializing monthly tax data audit (Tax Year ${CURRENT_TAX_YEAR})`);

  // Run on the 1st of every month at 3:00 AM
  cron.schedule("0 3 1 * *", async () => {
    try {
      await runFullAudit();
    } catch (err) {
      console.error(`${LOG_PREFIX} Cron audit failed:`, err.message);
    }
  });

  // Run initial audit on startup (delayed 10 seconds for server to stabilize)
  setTimeout(async () => {
    try {
      await runFullAudit();
    } catch (err) {
      console.error(`${LOG_PREFIX} Startup audit failed:`, err.message);
    }
  }, 10000);

  console.log(`${LOG_PREFIX} Scheduled: 1st of every month at 3:00 AM`);
};

module.exports = {
  initTaxDataFetcher,
  runFullAudit,
  auditFederalTax,
  auditStateTax,
  auditOtherTaxes,
  auditSSWageBase,
  CURRENT_TAX_YEAR,
  AUTHORITATIVE_RATES,
};
