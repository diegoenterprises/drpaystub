const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");

// Payroll software metadata profiles for authentic PDF output
const PAYROLL_PROFILES = [
  {
    producer: "ADP Workforce Now v12.4.1",
    creator: "ADP Payroll Engine",
    author: "ADP, LLC",
  },
  {
    producer: "Paychex Flex v8.2.0",
    creator: "Paychex Payroll Processing",
    author: "Paychex, Inc.",
  },
  {
    producer: "Gusto Payroll v5.1.3",
    creator: "Gusto Pay Engine",
    author: "Gusto, Inc.",
  },
  {
    producer: "QuickBooks Payroll v24.0",
    creator: "Intuit Payroll Services",
    author: "Intuit Inc.",
  },
  {
    producer: "Workday HCM v2024.1",
    creator: "Workday Payroll",
    author: "Workday, Inc.",
  },
];

// Select a consistent profile per company name (deterministic)
function getPayrollProfile(companyName) {
  const hash = crypto
    .createHash("md5")
    .update(companyName || "default")
    .digest("hex");
  const index = parseInt(hash.substring(0, 8), 16) % PAYROLL_PROFILES.length;
  return PAYROLL_PROFILES[index];
}

// Generate a document verification hash
function generateDocumentHash(params) {
  const payload = JSON.stringify({
    company: params.company_name,
    employee: params.employee_name,
    date: params.date,
    net: params.net_pay,
    ts: params._generationTimestamp,
  });
  return crypto.createHash("sha256").update(payload).digest("hex").substring(0, 16).toUpperCase();
}

// ─── SVG Paystub Renderer (sharp-based, zero browser dependency) ────────────
// Renders professional paystub images at 2x DPI using SVG → PNG via sharp.
// No Chromium, no Puppeteer, no Playwright. Pure native rendering.

const SVG_WIDTH = 1200;
const SVG_SCALE = 2; // 2x for retina/print quality

function esc(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function fmt$(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return "$0.00";
  return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function numberToWords(num) {
  if (num === 0) return "ZERO";
  const ones = ["","ONE","TWO","THREE","FOUR","FIVE","SIX","SEVEN","EIGHT","NINE",
    "TEN","ELEVEN","TWELVE","THIRTEEN","FOURTEEN","FIFTEEN","SIXTEEN","SEVENTEEN","EIGHTEEN","NINETEEN"];
  const tens = ["","","TWENTY","THIRTY","FORTY","FIFTY","SIXTY","SEVENTY","EIGHTY","NINETY"];
  function convert(n) {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n/10)] + (n%10 ? " " + ones[n%10] : "");
    if (n < 1000) return ones[Math.floor(n/100)] + " HUNDRED" + (n%100 ? " " + convert(n%100) : "");
    if (n < 1000000) return convert(Math.floor(n/1000)) + " THOUSAND" + (n%1000 ? " " + convert(n%1000) : "");
    return convert(Math.floor(n/1000000)) + " MILLION" + (n%1000000 ? " " + convert(n%1000000) : "");
  }
  const dollars = Math.floor(Math.abs(num));
  const cents = Math.round((Math.abs(num) - dollars) * 100);
  return convert(dollars) + " DOLLARS AND " + (cents < 10 ? "0" : "") + cents + "/100";
}

function buildPaystubSVG(params) {
  const W = SVG_WIDTH;
  const F = 'font-family="sans-serif"';
  const P = 30; // page padding
  let y = 0;
  const lines = [];
  const push = (s) => lines.push(s);

  // ── Colors matching reference ──
  const BLUE_BAR = "#c4cbe5";
  const BLUE_DARK = "#0052a1";
  const TABLE_BG = "#dee1f0";
  const BORDER = "#abbae1";
  const GRAY_BG = "#d0d2d4";
  const YELLOW = "#ffffcc";
  const BLACK = "#000000";
  const GRAY = "#666666";

  // ══════════════════════════════════════════════════════════════
  // SECTION 1: EARNINGS STATEMENT (top half)
  // ══════════════════════════════════════════════════════════════

  y = 30;

  // ── Company Info (top-left) ──
  push(`<text x="${P}" y="${y}" font-size="18" font-weight="700" font-style="italic" fill="${BLACK}" ${F}>${esc(params.company_name || "Company")}</text>`);
  y += 16;
  push(`<text x="${P}" y="${y}" font-size="11" font-style="italic" fill="${BLACK}" ${F}>${esc(params.state || "")}</text>`);

  // ── Earnings Statement Title (top-right) ──
  push(`<text x="${W * 0.52}" y="30" font-size="24" font-weight="700" fill="${BLACK}" ${F}>Earnings Statement</text>`);

  // ── Saurellius Logo (far right) ──
  push(`<polygon points="${W - 70},15 ${W - 40},35 ${W - 70},55 ${W - 100},35" fill="${BLUE_DARK}" opacity="0.8"/>`);
  push(`<polygon points="${W - 60},20 ${W - 35},37 ${W - 60},54 ${W - 85},37" fill="#4a7dd4" opacity="0.7"/>`);

  // ── Period Info (right side, below title) ──
  const periodX = W * 0.52;
  const valX = W * 0.72;
  let py = 55;
  push(`<text x="${periodX}" y="${py}" font-size="12" fill="${GRAY}" ${F}>Period Start:</text>`);
  push(`<text x="${valX}" y="${py}" font-size="12" fill="${BLACK}" ${F}>${esc(params.startDate || "")}</text>`);
  py += 18;
  push(`<text x="${periodX}" y="${py}" font-size="12" fill="${GRAY}" ${F}>Period Ending:</text>`);
  push(`<text x="${valX}" y="${py}" font-size="12" fill="${BLACK}" ${F}>${esc(params.actualPayDate || "")}</text>`);
  py += 18;
  push(`<text x="${periodX}" y="${py}" font-size="12" fill="${GRAY}" ${F}>Pay date:</text>`);
  push(`<text x="${valX}" y="${py}" font-size="12" fill="${BLACK}" ${F}>${esc(params.actualPayDate || params.date || "")}</text>`);

  // ── Employee Info (left side, below company) ──
  y = 75;
  push(`<text x="${P}" y="${y}" font-size="11" fill="${BLACK}" ${F}>SSN: ${esc(params.ssid || "XXX-XX-XXXX")}</text>`);
  y += 15;
  push(`<text x="${P}" y="${y}" font-size="11" fill="${BLACK}" ${F}>Taxable Marital Status: ${esc(params.maritial_status || "Single Taxpayers")}</text>`);
  y += 15;
  push(`<text x="${P}" y="${y}" font-size="11" fill="${BLACK}" ${F}>Exemptions/Allowances:</text>`);
  y += 15;
  push(`<text x="${P + 10}" y="${y}" font-size="11" fill="${BLACK}" ${F}>Federal: 12.00</text>`);
  y += 15;
  push(`<text x="${P + 10}" y="${y}" font-size="11" fill="${BLACK}" ${F}>State: 4.00</text>`);
  y += 15;
  push(`<text x="${P + 10}" y="${y}" font-size="11" fill="${BLACK}" ${F}>Medicare: 1.45</text>`);

  // ── Employee Name + State (right-center) ──
  push(`<text x="${periodX}" y="130" font-size="16" font-weight="700" fill="${BLACK}" ${F}>${esc(params.employee_name || "")}</text>`);
  push(`<text x="${periodX}" y="148" font-size="13" fill="${BLACK}" ${F}>${esc(params.state || "")}</text>`);

  // ═══════════ TABLES AREA ═══════════
  y = 190;
  const TH = 24;
  const TR = 22;

  // ── Left: Earnings + Deductions Table ──
  const LT = P; // left table x
  const LW = W * 0.58; // left table width
  const RT = LT + LW + 20; // right table x
  const RW = W - RT - P; // right table width

  // Earnings Header
  push(`<rect x="${LT}" y="${y}" width="${LW}" height="${TH}" fill="${TABLE_BG}" stroke="${BORDER}" stroke-width="1"/>`);
  const eC = [LT + 8, LT + LW * 0.24, LT + LW * 0.40, LT + LW * 0.60, LT + LW * 0.82];
  push(`<text x="${eC[0]}" y="${y + 16}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>Earnings</text>`);
  push(`<text x="${eC[1]}" y="${y + 16}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>Rate</text>`);
  push(`<text x="${eC[2]}" y="${y + 16}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>Hours</text>`);
  push(`<text x="${eC[3]}" y="${y + 16}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>This period</text>`);
  push(`<text x="${eC[4]}" y="${y + 16}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>Year to date</text>`);
  y += TH;

  // Earnings rows
  const earningsLabels = params.earnings_labels && params.earnings_labels.length > 0
    ? params.earnings_labels : ["Regular Earnings"];
  const incomeArr = Array.isArray(params.income) ? params.income : [params.income || params.currentTotal || "0"];

  earningsLabels.forEach((label, i) => {
    push(`<rect x="${LT}" y="${y}" width="${LW}" height="${TR}" fill="#ffffff" stroke="${BORDER}" stroke-width="0.5"/>`);
    push(`<text x="${eC[0]}" y="${y + 15}" font-size="10" fill="${BLACK}" ${F}>${esc(label)}</text>`);
    if (params.hourly_rate) {
      push(`<text x="${eC[1]}" y="${y + 15}" font-size="10" fill="${BLACK}" ${F}>${esc(params.hourly_rate)}</text>`);
      push(`<text x="${eC[2]}" y="${y + 15}" font-size="10" fill="${BLACK}" ${F}>${esc(params.hours_worked || "")}</text>`);
    }
    push(`<text x="${eC[3]}" y="${y + 15}" font-size="10" fill="${BLACK}" ${F}>${fmt$(incomeArr[i] || incomeArr[0])}</text>`);
    push(`<text x="${eC[4]}" y="${y + 15}" font-size="10" fill="${BLACK}" ${F}>${fmt$(params.ytd_gross || incomeArr[i] || incomeArr[0])}</text>`);
    y += TR;
  });

  // Gross Pay row (yellow highlight)
  push(`<rect x="${LT}" y="${y}" width="${LW}" height="${TR}" fill="${YELLOW}" stroke="${BORDER}" stroke-width="1"/>`);
  push(`<text x="${eC[1]}" y="${y + 15}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>Gross Pay</text>`);
  push(`<text x="${eC[3]}" y="${y + 15}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>${fmt$(params.currentTotal)}</text>`);
  push(`<text x="${eC[4]}" y="${y + 15}" font-size="10" fill="${BLACK}" ${F}>${fmt$(params.ytd_gross)}</text>`);
  y += TR;

  // Deductions Header
  push(`<rect x="${LT}" y="${y}" width="${LW}" height="${TH}" fill="${TABLE_BG}" stroke="${BORDER}" stroke-width="1"/>`);
  push(`<text x="${eC[0]}" y="${y + 16}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>Deductions</text>`);
  push(`<text x="${eC[1]}" y="${y + 16}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>Statutory</text>`);
  y += TH;

  // Deduction rows
  const dedLabels = params.deduction_labels || [];
  const dedCurrent = params.deductions_current || [];
  const dedYtd = params.deduction_ytd || [];

  dedLabels.forEach((label, i) => {
    push(`<rect x="${LT}" y="${y}" width="${LW}" height="${TR}" fill="#ffffff" stroke="${BORDER}" stroke-width="0.5"/>`);
    push(`<text x="${eC[1]}" y="${y + 15}" font-size="10" fill="${BLACK}" ${F}>${esc(label)}</text>`);
    push(`<text x="${eC[3]}" y="${y + 15}" font-size="10" fill="${BLACK}" ${F}>-${fmt$(dedCurrent[i] || "0")}</text>`);
    push(`<text x="${eC[4]}" y="${y + 15}" font-size="10" fill="${BLACK}" ${F}>-${fmt$(dedYtd[i] || "0")}</text>`);
    y += TR;
  });

  // Net Pay row (highlighted)
  push(`<rect x="${LT}" y="${y}" width="${LW}" height="${TR + 4}" fill="${YELLOW}" stroke="${BORDER}" stroke-width="1"/>`);
  push(`<text x="${eC[0]}" y="${y + 16}" font-size="11" font-weight="700" fill="${BLACK}" ${F}>Net Pay</text>`);
  push(`<text x="${eC[3]}" y="${y + 16}" font-size="11" font-weight="700" fill="${BLACK}" ${F}>${fmt$(params.net_pay)}</text>`);
  push(`<text x="${eC[4]}" y="${y + 16}" font-size="11" fill="${BLACK}" ${F}>${fmt$(params.ytd_netPay)}</text>`);
  y += TR + 4;

  // ── Right: Other Benefits Table ──
  const rty = 190; // same starting y as earnings
  push(`<rect x="${RT}" y="${rty}" width="${RW}" height="${TH}" fill="${TABLE_BG}" stroke="${BORDER}" stroke-width="1"/>`);
  push(`<text x="${RT + 8}" y="${rty + 16}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>Other Benefits and Information</text>`);
  push(`<text x="${RT + RW - 8}" y="${rty + 16}" font-size="10" font-weight="700" fill="${BLACK}" text-anchor="end" ${F}>Amount</text>`);
  push(`<rect x="${RT}" y="${rty + TH}" width="${RW}" height="${TH}" fill="#ffffff" stroke="${BORDER}" stroke-width="0.5"/>`);
  push(`<text x="${RT + 8}" y="${rty + TH + 16}" font-size="10" font-weight="600" fill="${BLACK}" ${F}>Important Notes</text>`);
  // Notes content
  if (params.company_notes) {
    push(`<rect x="${RT}" y="${rty + TH * 2}" width="${RW}" height="${TR * 3}" fill="#ffffff" stroke="${BORDER}" stroke-width="0.5"/>`);
    push(`<text x="${RT + 8}" y="${rty + TH * 2 + 15}" font-size="9" fill="${GRAY}" ${F}>${esc(params.company_notes)}</text>`);
  } else {
    push(`<rect x="${RT}" y="${rty + TH * 2}" width="${RW}" height="${TR * 3}" fill="#ffffff" stroke="${BORDER}" stroke-width="0.5"/>`);
  }

  // ── Saurellius Copyright (right edge, vertical) ──
  push(`<text x="${W - 12}" y="250" font-size="8" fill="${GRAY}" ${F} transform="rotate(90, ${W - 12}, 250)">\u00A9 2024, 2025, 2026, SAURELLIUS</text>`);
  push(`<text x="${W - 12}" y="420" font-size="9" font-weight="700" fill="${BLACK}" ${F} transform="rotate(90, ${W - 12}, 420)">\u25BC TEAR HERE</text>`);

  // ══════════════════════════════════════════════════════════════
  // SECTION 2: CHECK VOUCHER (bottom half)
  // ══════════════════════════════════════════════════════════════

  // Dashed tear line
  y += 20;
  push(`<line x1="${P}" y1="${y}" x2="${W - P}" y2="${y}" stroke="${GRAY}" stroke-width="1" stroke-dasharray="8,4"/>`);
  y += 6;

  // ── Authentication Gradient Bar ──
  push(`<defs><linearGradient id="authGrad" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" style="stop-color:#c4cbe5;stop-opacity:1" />
    <stop offset="50%" style="stop-color:#a0b0d0;stop-opacity:1" />
    <stop offset="100%" style="stop-color:#c4cbe5;stop-opacity:1" />
  </linearGradient></defs>`);
  push(`<rect x="${P}" y="${y}" width="${W - P * 2}" height="20" fill="url(#authGrad)"/>`);
  push(`<text x="${W / 2}" y="${y + 14}" font-size="7" font-weight="700" fill="#333" text-anchor="middle" ${F} letter-spacing="0.5">VERIFY DOCUMENT AUTHENTICITY: COLOR AREA MUST CHANGE IN TONE GRADUALLY AND EVENLY FROM DARK AT TOP TO LIGHTER AT BOTTOM</text>`);
  y += 24;

  // ── Check Number (red, right-aligned) ──
  const checkNumber = params.check_number || "D" + Math.floor(100000 + Math.random() * 900000);
  push(`<text x="${W - P - 10}" y="${y + 18}" font-size="28" font-weight="700" fill="#f4836c" text-anchor="end" ${F}>${esc(checkNumber)}</text>`);

  // ── Employee name + pay info ──
  y += 10;
  push(`<text x="${P + 20}" y="${y}" font-size="13" fill="${BLACK}" ${F}>${esc(params.employee_name || "")}</text>`);
  y += 16;
  push(`<text x="${P + 20}" y="${y}" font-size="11" fill="${BLACK}" ${F}>${esc(params.state || "")}</text>`);

  // Right side check info
  const ciX = W * 0.50;
  const civX = W * 0.72;
  push(`<text x="${ciX}" y="${y - 16}" font-size="11" fill="${GRAY}" ${F}>Payroll check number:</text>`);
  push(`<text x="${civX}" y="${y - 16}" font-size="11" fill="${BLACK}" ${F}>${esc(checkNumber)}</text>`);
  push(`<text x="${ciX}" y="${y}" font-size="11" fill="${GRAY}" ${F}>Pay date:</text>`);
  push(`<text x="${civX}" y="${y}" font-size="11" fill="${BLACK}" ${F}>${esc(params.actualPayDate || params.date || "")}</text>`);
  push(`<text x="${ciX}" y="${y + 16}" font-size="11" fill="${GRAY}" ${F}>Social Security No</text>`);
  push(`<text x="${civX}" y="${y + 16}" font-size="11" fill="${BLACK}" ${F}>${esc(params.ssid || "XXX-XX-XXXX")}</text>`);

  // ── Pay to the order of ──
  y += 44;
  push(`<line x1="${P}" y1="${y - 4}" x2="${W - P}" y2="${y - 4}" stroke="#676464" stroke-width="1.5"/>`);
  push(`<text x="${P + 8}" y="${y + 14}" font-size="10" fill="${GRAY}" ${F}>Pay to the</text>`);
  push(`<text x="${P + 8}" y="${y + 26}" font-size="10" fill="${GRAY}" ${F}>order of:</text>`);
  push(`<text x="${P + 80}" y="${y + 22}" font-size="18" font-weight="700" fill="${BLACK}" ${F}>${esc((params.employee_name || "").toUpperCase())}</text>`);

  // ── Amount in words + amount box ──
  y += 40;
  push(`<text x="${P + 8}" y="${y + 4}" font-size="10" fill="${GRAY}" ${F}>This amount:</text>`);
  const netPay = parseFloat(params.net_pay) || 0;
  const amountWords = numberToWords(netPay);
  // Amount words box
  push(`<rect x="${P + 80}" y="${y - 10}" width="${W * 0.55}" height="28" fill="${GRAY_BG}" stroke="#676464" stroke-width="1"/>`);
  push(`<text x="${P + 88}" y="${y + 5}" font-size="9" font-weight="600" fill="${BLACK}" ${F}>${esc(amountWords)}</text>`);
  // Dollar amount box
  push(`<rect x="${W - P - 130}" y="${y - 10}" width="120" height="28" fill="#ffffff" stroke="#676464" stroke-width="1.5"/>`);
  push(`<text x="${W - P - 70}" y="${y + 8}" font-size="14" font-weight="700" fill="${BLACK}" text-anchor="middle" ${F}>${fmt$(params.net_pay)}</text>`);

  // ── Disclaimers ──
  y += 40;
  push(`<text x="${P + 80}" y="${y}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>THIS IS NOT A CHECK</text>`);
  push(`<text x="${P + 80}" y="${y + 14}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>NON-NEGOTIABLE</text>`);
  push(`<text x="${P + 80}" y="${y + 28}" font-size="10" font-weight="700" fill="${BLACK}" ${F}>VOID AFTER 180 DAYS</text>`);

  // Authorized signature
  push(`<line x1="${W * 0.52}" y1="${y + 20}" x2="${W - P - 10}" y2="${y + 20}" stroke="#676464" stroke-width="1"/>`);
  push(`<text x="${W * 0.58}" y="${y + 34}" font-size="9" fill="${GRAY}" ${F}>AUTHORIZED SIGNATURE ()</text>`);
  push(`<text x="${W * 0.58}" y="${y + 46}" font-size="9" fill="${GRAY}" ${F}>VOID AFTER 90 DAYS</text>`);

  if (params.sign) {
    push(`<image href="${params.sign}" x="${W * 0.55}" y="${y - 10}" width="160" height="35" preserveAspectRatio="xMinYMin meet"/>`);
  }

  // ── Bottom Security Bar ──
  y += 60;
  push(`<rect x="${P}" y="${y}" width="${(W - P * 2) * 0.45}" height="18" fill="#cc3333"/>`);
  push(`<text x="${P + 10}" y="${y + 13}" font-size="7" font-weight="700" fill="#ffffff" ${F}>THE ORIGINAL DOCUMENT HAS SAURELLIUS WATERMARK</text>`);
  push(`<rect x="${P + (W - P * 2) * 0.45}" y="${y}" width="${(W - P * 2) * 0.55}" height="18" fill="${BLUE_BAR}"/>`);
  push(`<text x="${P + (W - P * 2) * 0.45 + 10}" y="${y + 13}" font-size="7" font-weight="700" fill="#333" ${F}>HOLD AT AN ANGLE TO VIEW WHEN CHECKING THE ENDORSEMENT</text>`);
  y += 30;

  const totalH = Math.max(y, 800);

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${totalH}" viewBox="0 0 ${W} ${totalH}">
    <rect width="${W}" height="${totalH}" fill="#ffffff"/>
    ${lines.join("\n    ")}
  </svg>`;
}

// Create high-resolution paystub image using SVG → sharp → PNG
// Accepts either params object (preferred) or raw HTML (legacy fallback)
async function createHighResImage(outputPath, paramsOrHtml) {
  let svgString;

  if (typeof paramsOrHtml === "object" && paramsOrHtml !== null && !Buffer.isBuffer(paramsOrHtml)) {
    // New path: render from structured params via SVG
    svgString = buildPaystubSVG(paramsOrHtml);
  } else {
    // Legacy HTML fallback: create a minimal placeholder image
    // This handles any old callers still passing HTML strings
    svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="800" viewBox="0 0 ${SVG_WIDTH} 800">
      <rect width="${SVG_WIDTH}" height="800" fill="#ffffff"/>
      <text x="600" y="400" font-size="24" fill="#1d1d1f" text-anchor="middle" font-family="sans-serif">Pay Statement</text>
    </svg>`;
  }

  const svgBuffer = Buffer.from(svgString);
  await sharp(svgBuffer, { density: 144 * SVG_SCALE })
    .png({ quality: 95, compressionLevel: 6 })
    .toFile(outputPath);
}

// ─── Snappt-Resistant PDF Generator ─────────────────────────────────────────
// Generates PDFs that mimic the structure of real payroll software output.
// Key anti-detection layers:
//   1. Authentic payroll software metadata (randomized per company)
//   2. Full invisible text layer mirroring ALL visible content (Snappt text-match)
//   3. PDF permissions matching real payroll software (no modify, high-res print)
//   4. Owner password (prevents casual editing, signals professional generation)
//   5. Micro-hash footer for document integrity verification
//   6. Consistent CreationDate/ModDate (no edit artifacts)
//   7. PDF 1.7 spec compliance
//   8. Content stream compression (standard for machine-generated docs)

function fmt$PDF(val) {
  const n = parseFloat(val);
  if (isNaN(n)) return "$0.00";
  return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function generateSecurePDF(imagePath, outputPath, params, options = {}) {
  return new Promise((resolve, reject) => {
    const profile = getPayrollProfile(params.company_name);
    const generationDate = params._generationTimestamp
      ? new Date(params._generationTimestamp)
      : new Date();
    const docHash = generateDocumentHash(params);

    const doc = new PDFDocument({
      size: "letter",
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      info: {
        Title: `Pay Statement - ${params.employee_name || "Employee"}`,
        Author: profile.author,
        Subject: `Payroll Statement ${params.date || ""}`,
        Keywords: "payroll, pay statement, earnings, direct deposit",
        Creator: profile.creator,
        Producer: profile.producer,
        CreationDate: generationDate,
        ModDate: generationDate,
      },
      permissions: {
        printing: "highResolution",
        modifying: false,
        copying: true,
        annotating: false,
        fillingForms: false,
        contentAccessibility: true,
        documentAssembly: false,
      },
      ownerPassword: crypto.randomBytes(16).toString("hex"),
      userPassword: (options && options.userPassword) || undefined,
      pdfVersion: "1.7",
      compress: true,
      autoFirstPage: true,
    });

    const stream = doc.pipe(fs.createWriteStream(outputPath));

    const pageWidth = 612;
    const pageHeight = 792;

    // ── Layer 1: Full-page paystub image ──
    if (fs.existsSync(imagePath)) {
      doc.image(imagePath, 0, 12, {
        width: pageWidth,
        height: pageHeight - 24,
        align: "center",
        valign: "center",
      });
    }

    // ── Layer 2: Full invisible text layer ──
    // Snappt's primary detection method: text extraction & comparison.
    // Real payroll PDFs have ALL text as selectable/searchable content.
    // We embed every data field at approximate positions matching the image layout.
    // Font size 0.1pt, white fill at 0.1% opacity = invisible to human eye,
    // fully readable by PDF text extractors.
    const T = (text, x, y, opts = {}) => {
      if (!text && text !== 0) return;
      doc.fontSize(0.1).fillColor("white").fillOpacity(0.001);
      doc.text(String(text), x, y, { continued: false, ...opts });
    };

    // Company header block (top of page)
    T("PAY STATEMENT", 250, 20);
    T(params.company_name, 30, 30);
    T(params.company_address, 30, 38);
    T(params.company_phone ? `Tel: ${params.company_phone}` : "", 30, 46);
    T(params.company_ein ? `EIN: ${params.company_ein}` : "", 30, 54);
    T(params.actualPayDate || params.date, 400, 30);
    T(params.startDate ? `Period: ${params.startDate}` : "", 400, 38);

    // Employee info block
    T("EMPLOYEE", 30, 90);
    T(params.employee_name, 30, 100);
    T(params.employee_address, 30, 108);
    T(params.ssid ? `SSN: ${params.ssid}` : "", 30, 116);
    T(params.employee_Id ? `Employee ID: ${params.employee_Id}` : "", 30, 124);

    // Pay details block
    T("PAY DETAILS", 320, 90);
    T(params.check_number ? `Check #: ${params.check_number}` : "", 320, 100);
    if (params.hourly_rate) {
      T(`Rate: ${fmt$PDF(params.hourly_rate)}/hr`, 320, 108);
      T(`Hours: ${params.hours_worked || ""}`, 320, 116);
    } else {
      T("Salaried Employee", 320, 108);
    }
    T(params.bank_name ? `Bank: ${params.bank_name}` : "", 320, 124);
    T(params.routingNumber ? `Routing: ${params.routingNumber}` : "", 320, 132);

    // Earnings table header
    let ty = 160;
    T("EARNINGS", 30, ty);
    T("Description", 30, ty + 10);
    T("Rate / Hours", 250, ty + 10);
    T("Current", 370, ty + 10);
    T("YTD", 480, ty + 10);
    ty += 20;

    // Earnings rows
    const earningsLabels = params.earnings_labels || ["Regular"];
    const incomeArr = Array.isArray(params.income) ? params.income : [params.income || "0"];
    earningsLabels.forEach((label, i) => {
      T(label, 30, ty);
      if (params.hourly_rate) {
        T(`${fmt$PDF(params.hourly_rate)} × ${params.hours_worked || ""}`, 250, ty);
      }
      T(fmt$PDF(incomeArr[i] || incomeArr[0]), 370, ty);
      T(fmt$PDF(params.ytd_gross || incomeArr[i] || incomeArr[0]), 480, ty);
      ty += 10;
    });

    // Gross pay
    T("Gross Pay", 30, ty);
    T(fmt$PDF(params.currentTotal), 370, ty);
    T(fmt$PDF(params.ytd_gross), 480, ty);
    ty += 20;

    // Deductions table
    if (params.deduction_labels && params.deduction_labels.length > 0) {
      T("DEDUCTIONS", 30, ty);
      T("Description", 30, ty + 10);
      T("Current", 370, ty + 10);
      T("YTD", 480, ty + 10);
      ty += 20;

      params.deduction_labels.forEach((label, i) => {
        T(label, 30, ty);
        const curDed = params.deductions_current ? params.deductions_current[i] : "0";
        const ytdDed = params.deduction_ytd ? params.deduction_ytd[i] : "0";
        T(`-${fmt$PDF(curDed)}`, 370, ty);
        T(`-${fmt$PDF(ytdDed)}`, 480, ty);
        ty += 10;
      });

      T("Total Deductions", 30, ty);
      T(`-${fmt$PDF(params.currentDeductions)}`, 370, ty);
      T(`-${fmt$PDF(params.ytd_deductions)}`, 480, ty);
      ty += 20;
    }

    // Net pay summary
    T("NET PAY", 30, ty);
    T(fmt$PDF(params.net_pay), 30, ty + 12);
    T(params.ytd_netPay ? `YTD Net: ${fmt$PDF(params.ytd_netPay)}` : "", 370, ty + 12);
    ty += 30;

    // Notes
    if (params.company_notes) {
      T("NOTES", 30, ty);
      T(params.company_notes, 30, ty + 10);
      ty += 20;
    }

    // Manager / Signature
    if (params.manager) {
      T(`Authorized: ${params.manager}`, 30, ty);
      ty += 10;
    }

    // Bank deposit info (partial, for text match)
    if (params.bank_name) {
      T("DIRECT DEPOSIT INFORMATION", 30, ty);
      T(params.bank_name, 30, ty + 10);
      T(params.bank_street_address || "", 30, ty + 18);
      T(`${params.bank_city || ""} ${params.bank_state || ""} ${params.bank_zip || ""}`, 30, ty + 26);
    }

    // ── Layer 3: Verified employer address security layer ──
    let verifiedAddr = null;
    try { verifiedAddr = params.company_address_verified ? JSON.parse(params.company_address_verified) : null; } catch(e) {}
    if (verifiedAddr && verifiedAddr.placeId) {
      doc.fontSize(0.1).fillColor("white").fillOpacity(0.001);
      T("VERIFIED_EMPLOYER_ADDRESS:" + (verifiedAddr.formatted || ""), 30, ty + 40);
      T("PLACE_ID:" + verifiedAddr.placeId, 30, ty + 48);
      T("GEO:" + (verifiedAddr.lat || "") + "," + (verifiedAddr.lng || ""), 30, ty + 56);
      T("LOCALITY:" + (verifiedAddr.city || "") + "|" + (verifiedAddr.stateCode || "") + "|" + (verifiedAddr.zip || ""), 30, ty + 64);
      if (verifiedAddr.county) T("COUNTY:" + verifiedAddr.county, 30, ty + 72);
    }

    // ── Layer 4: Micro-hash footer (machine-readable document integrity) ──
    const addrHash = verifiedAddr ? crypto.createHash("sha256")
      .update(`${verifiedAddr.placeId || ""}|${verifiedAddr.lat || ""}|${verifiedAddr.lng || ""}`)
      .digest("hex").substring(0, 8).toUpperCase() : "UNVERIFIED";
    doc.fontSize(1).fillColor("white").fillOpacity(0.01);
    doc.text(
      `DOCID:${docHash} VER:${profile.producer} TS:${generationDate.toISOString()} ADDR:${addrHash}`,
      10,
      pageHeight - 5,
      { width: pageWidth - 20, align: "center" }
    );

    // ── Layer 5: Secondary integrity hash (includes employer address) ──
    const checkHash = crypto
      .createHash("md5")
      .update(`${params.company_name}|${params.employee_name}|${params.net_pay}|${params.date}|${params.company_address || ""}`)
      .digest("hex")
      .substring(0, 12)
      .toUpperCase();
    doc.fontSize(0.5).fillColor("white").fillOpacity(0.005);
    doc.text(
      `CHK:${checkHash} PRF:${profile.producer.replace(/\s/g, "_")} LOC:${addrHash}`,
      pageWidth - 200,
      pageHeight - 8,
      { width: 190, align: "right" }
    );

    doc.end();

    stream.on("finish", () => {
      resolve({
        path: outputPath,
        hash: docHash,
        profile: profile.producer,
      });
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
}

// Inject security CSS into EJS template HTML
function injectSecurityCSS(html) {
  const securityCSS = `
    <style>
      /* Micro-pattern background for authenticity */
      body::before {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9999;
        background-image: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 99px,
          rgba(200, 200, 210, 0.03) 99px,
          rgba(200, 200, 210, 0.03) 100px
        ),
        repeating-linear-gradient(
          90deg,
          transparent,
          transparent 99px,
          rgba(200, 200, 210, 0.03) 99px,
          rgba(200, 200, 210, 0.03) 100px
        );
      }
      /* Anti-analysis noise layer */
      body::after {
        content: "";
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 9998;
        background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='1' height='1' fill='%23000' fill-opacity='0.003'/%3E%3C/svg%3E");
      }
    </style>
  `;
  return html.replace("</head>", securityCSS + "</head>");
}

// Fix font references in HTML to not point to drpaystub.com
function fixFontReferences(html) {
  const assetsDir = "file://" + path.join(__dirname, "../assets/").replace(/ /g, "%20");
  // Replace all drpaystub.com variants with local asset paths
  html = html.replace(/https?:\/\/(www\.)?drpaystub\.(com|net)\/files\//g, assetsDir + "files/");
  html = html.replace(/https?:\/\/(www\.)?drpaystub\.(com|net)\//g, assetsDir);
  return html;
}

module.exports = {
  createHighResImage,
  generateSecurePDF,
  getPayrollProfile,
  generateDocumentHash,
  injectSecurityCSS,
  fixFontReferences,
  PAYROLL_PROFILES,
};
