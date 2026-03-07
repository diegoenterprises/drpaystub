const express = require("express");
const router = express.Router();
const { PDFDocument } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const AdmZip = require("adm-zip");

const W2Record = require("../models/W2Record");
const TEMPLATE_PATH = path.join(__dirname, "..", "templates", "fw2.pdf");

// ─── Stripe Setup ────────────────────────────────────────────────────────────
const { STRIPE_LIVE_KEY, STRIPE_TEST_KEY, STRIPE_MODE } = process.env;
const stripeKey = STRIPE_MODE === "dev" ? STRIPE_TEST_KEY : STRIPE_LIVE_KEY;
const stripe = require("stripe")(stripeKey);

function optionalUserId(req) {
  try {
    const token = (req.headers.authorization || "").split(" ")[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.payload?.user || null;
  } catch {
    return null;
  }
}

// ─── Payment Intent ($20) ────────────────────────────────────────────────────
router.get("/payment-intent", async (req, res) => {
  try {
    const amount = 2000; // $20

    let stripeCustomerId = null;
    const userId = optionalUserId(req);
    if (userId) {
      try {
        const { User } = require("../models/user");
        const dbUser = await User.findById(userId)
          .select("stripeCustomerId email firstName lastName")
          .lean();
        if (dbUser?.stripeCustomerId) {
          stripeCustomerId = dbUser.stripeCustomerId;
        } else if (dbUser?.email) {
          const newCust = await stripe.customers.create({
            email: dbUser.email,
            name: [dbUser.firstName, dbUser.lastName]
              .filter(Boolean)
              .join(" ") || undefined,
            metadata: { userId: userId.toString() },
          });
          stripeCustomerId = newCust.id;
          await User.findByIdAndUpdate(userId, {
            stripeCustomerId: newCust.id,
          });
        }
      } catch (e) {
        console.error("[W2 Wizard] Customer lookup error:", e.message);
      }
    }

    const intentParams = {
      amount,
      currency: "usd",
      payment_method_types: ["card"],
      statement_descriptor_suffix: "Saurellius W2",
    };
    if (stripeCustomerId) intentParams.customer = stripeCustomerId;

    const paymentIntent = await stripe.paymentIntents.create(intentParams);
    return res.json({ secret: paymentIntent.client_secret });
  } catch (err) {
    console.error("[W2 Wizard] Payment intent error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ─── Field mapping for each copy ─────────────────────────────────────────────
// CopyA uses f1_XX, all other copies use f2_XX
const COPIES = [
  { prefix: "CopyA", fPrefix: "f1", cPrefix: "c1" },
  { prefix: "Copy1", fPrefix: "f2", cPrefix: "c2" },
  { prefix: "CopyB", fPrefix: "f2", cPrefix: "c2" },
  { prefix: "CopyC", fPrefix: "f2", cPrefix: "c2" },
  { prefix: "Copy2", fPrefix: "f2", cPrefix: "c2" },
  { prefix: "CopyD", fPrefix: "f2", cPrefix: "c2" },
];

function buildFieldName(copyPrefix, fieldSuffix) {
  return `topmostSubform[0].${copyPrefix}[0].${fieldSuffix}`;
}

function fillCopy(form, copy, data) {
  const f = copy.fPrefix;
  const c = copy.cPrefix;
  const cp = copy.prefix;

  const setText = (suffix, value) => {
    if (!value && value !== 0) return;
    try {
      const field = form.getTextField(buildFieldName(cp, suffix));
      field.setText(String(value));
    } catch (e) {
      // Field may not exist on some copies
    }
  };

  const setCheck = (suffix, value) => {
    if (!value) return;
    try {
      const field = form.getCheckBox(buildFieldName(cp, suffix));
      field.check();
    } catch (e) {}
  };

  // Box a - Employee SSN
  setText(`BoxA_ReadOrder[0].${f}_01[0]`, data.employeeSSN);
  // Box b - Employer EIN
  setText(`Col_Left[0].${f}_02[0]`, data.employerEIN);
  // Box c - Employer name, address, ZIP
  setText(`Col_Left[0].${f}_03[0]`, data.employerName);
  // Box c continued - employer address
  setText(`Col_Left[0].${f}_04[0]`, data.employerAddress);
  // Box d - Control number
  // (f_04 is sometimes control number on some copies, but in this PDF f_04 is employer address line 2)
  // Box e - Employee first name
  setText(`Col_Left[0].FirstName_ReadOrder[0].${f}_05[0]`, data.employeeFirstName);
  // Box e - Employee last name
  setText(`Col_Left[0].LastName_ReadOrder[0].${f}_06[0]`, data.employeeLastName);
  // Box f - Employee address line 1
  setText(`Col_Left[0].${f}_07[0]`, data.employeeAddress);
  // Box f - Employee city, state, ZIP
  setText(`Col_Left[0].${f}_08[0]`, data.employeeCityStateZip);

  // Right column - wage/tax boxes
  // Box 1 - Wages, tips, other compensation
  setText(`Col_Right[0].Box1_ReadOrder[0].${f}_09[0]`, data.box1);
  // Box 2 - Federal income tax withheld
  setText(`Col_Right[0].${f}_10[0]`, data.box2);
  // Box 3 - Social security wages
  setText(`Col_Right[0].Box3_ReadOrder[0].${f}_11[0]`, data.box3);
  // Box 4 - Social security tax withheld
  setText(`Col_Right[0].${f}_12[0]`, data.box4);
  // Box 5 - Medicare wages and tips
  setText(`Col_Right[0].Box5_ReadOrder[0].${f}_13[0]`, data.box5);
  // Box 6 - Medicare tax withheld
  setText(`Col_Right[0].${f}_14[0]`, data.box6);
  // Box 7 - Social security tips
  setText(`Col_Right[0].Box7_ReadOrder[0].${f}_15[0]`, data.box7);
  // Box 8 - Allocated tips
  setText(`Col_Right[0].${f}_16[0]`, data.box8);
  // Box 9 - (blank)
  setText(`Col_Right[0].${f}_17[0]`, data.box9);
  // Box 10 - Dependent care benefits
  setText(`Col_Right[0].Box10_ReadOrder[0].${f}_18[0]`, data.box10);
  // Box 11 - Nonqualified plans
  setText(`Col_Right[0].${f}_19[0]`, data.box11);

  // Box 12a-12d (code + amount pairs)
  // 12a
  const line12Key = cp === "CopyA" ? "Line12_ReadOrder" : "Box12_ReadOrder";
  setText(`Col_Right[0].${line12Key}[0].${f}_20[0]`, data.box12aCode);
  setText(`Col_Right[0].${line12Key}[0].${f}_21[0]`, data.box12aAmount);
  // 12b
  setText(`Col_Right[0].${line12Key}[0].${f}_22[0]`, data.box12bCode);
  setText(`Col_Right[0].${line12Key}[0].${f}_23[0]`, data.box12bAmount);
  // 12c
  setText(`Col_Right[0].${line12Key}[0].${f}_24[0]`, data.box12cCode);
  setText(`Col_Right[0].${line12Key}[0].${f}_25[0]`, data.box12cAmount);
  // 12d
  setText(`Col_Right[0].${line12Key}[0].${f}_26[0]`, data.box12dCode);
  setText(`Col_Right[0].${line12Key}[0].${f}_27[0]`, data.box12dAmount);

  // Box 13 - Checkboxes
  if (data.statutoryEmployee)
    setCheck(`Col_Right[0].Statutory_ReadOrder[0].${c}_2[0]`, true);
  if (data.retirementPlan)
    setCheck(`Col_Right[0].Retirement_ReadOrder[0].${c}_3[0]`, true);
  if (data.thirdPartySickPay)
    setCheck(`Col_Right[0].${c}_4[0]`, true);

  // Box 14 - Other
  setText(`Col_Right[0].${f}_28[0]`, data.box14Line1);
  setText(`Col_Right[0].${f}_29[0]`, data.box14Line2);
  setText(`Col_Right[0].${f}_30[0]`, data.box14Line3);

  // Box 15 - State & Employer's state ID (two lines)
  setText(`Boxes15_ReadOrder[0].Box15_ReadOrder[0].${f}_31[0]`, data.state1);
  setText(`Boxes15_ReadOrder[0].${f}_32[0]`, data.employerStateId1);
  setText(`Boxes15_ReadOrder[0].${f}_33[0]`, data.state2);
  setText(`Boxes15_ReadOrder[0].${f}_34[0]`, data.employerStateId2);

  // Box 16 - State wages (two lines)
  setText(`Box16_ReadOrder[0].${f}_35[0]`, data.stateWages1);
  setText(`Box16_ReadOrder[0].${f}_36[0]`, data.stateWages2);

  // Box 17 - State income tax (two lines)
  setText(`Box17_ReadOrder[0].${f}_37[0]`, data.stateTax1);
  setText(`Box17_ReadOrder[0].${f}_38[0]`, data.stateTax2);

  // Box 18 - Local wages (two lines)
  setText(`Box18_ReadOrder[0].${f}_39[0]`, data.localWages1);
  setText(`Box18_ReadOrder[0].${f}_40[0]`, data.localWages2);

  // Box 19 - Local income tax (two lines)
  setText(`Box19_ReadOrder[0].${f}_41[0]`, data.localTax1);
  setText(`Box19_ReadOrder[0].${f}_42[0]`, data.localTax2);

  // Box 20 - Locality name (two lines)
  setText(`${f}_43[0]`, data.localityName1);
  setText(`${f}_44[0]`, data.localityName2);
}

// ─── Generate W-2 PDF ────────────────────────────────────────────────────────
router.post("/generate", async (req, res) => {
  try {
    const data = req.body;

    // Build employer address string
    const employerAddr = [
      data.employerAddress1,
      data.employerAddress2,
      [data.employerCity, data.employerState, data.employerZip]
        .filter(Boolean)
        .join(", "),
    ]
      .filter(Boolean)
      .join("\n");

    // Build employee city/state/zip
    const empCityStateZip = [data.employeeCity, data.employeeState, data.employeeZip]
      .filter(Boolean)
      .join(", ");

    const fillData = {
      employeeSSN: data.employeeSSN || "",
      employerEIN: data.employerEIN || "",
      employerName: data.employerName || "",
      employerAddress: employerAddr,
      employeeFirstName: data.employeeFirstName || "",
      employeeLastName: data.employeeLastName || "",
      employeeAddress: data.employeeAddress1 || "",
      employeeCityStateZip: empCityStateZip,
      box1: data.box1 || "",
      box2: data.box2 || "",
      box3: data.box3 || "",
      box4: data.box4 || "",
      box5: data.box5 || "",
      box6: data.box6 || "",
      box7: data.box7 || "",
      box8: data.box8 || "",
      box9: data.box9 || "",
      box10: data.box10 || "",
      box11: data.box11 || "",
      box12aCode: data.box12aCode || "",
      box12aAmount: data.box12aAmount || "",
      box12bCode: data.box12bCode || "",
      box12bAmount: data.box12bAmount || "",
      box12cCode: data.box12cCode || "",
      box12cAmount: data.box12cAmount || "",
      box12dCode: data.box12dCode || "",
      box12dAmount: data.box12dAmount || "",
      statutoryEmployee: data.statutoryEmployee || false,
      retirementPlan: data.retirementPlan || false,
      thirdPartySickPay: data.thirdPartySickPay || false,
      box14Line1: data.box14Line1 || "",
      box14Line2: data.box14Line2 || "",
      box14Line3: data.box14Line3 || "",
      state1: data.state1 || "",
      employerStateId1: data.employerStateId1 || "",
      state2: data.state2 || "",
      employerStateId2: data.employerStateId2 || "",
      stateWages1: data.stateWages1 || "",
      stateWages2: data.stateWages2 || "",
      stateTax1: data.stateTax1 || "",
      stateTax2: data.stateTax2 || "",
      localWages1: data.localWages1 || "",
      localWages2: data.localWages2 || "",
      localTax1: data.localTax1 || "",
      localTax2: data.localTax2 || "",
      localityName1: data.localityName1 || "",
      localityName2: data.localityName2 || "",
    };

    // Load PDF template
    const templateBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(templateBytes, {
      ignoreEncryption: true,
    });
    const form = pdfDoc.getForm();

    // Fill all 6 copies
    for (const copy of COPIES) {
      fillCopy(form, copy, fillData);
    }

    // Flatten form so fields are not editable
    form.flatten();

    // Save
    const pdfBytes = await pdfDoc.save();

    // Create a unique filename
    const timestamp = Date.now();
    const safeName = (data.employeeLastName || "w2").replace(/[^a-zA-Z0-9]/g, "");
    const filename = `W2_${safeName}_${timestamp}.pdf`;
    const outputDir = path.join(__dirname, "..", "public");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const pdfPath = path.join(outputDir, filename);
    fs.writeFileSync(pdfPath, pdfBytes);

    // Also create a ZIP
    const zipFilename = `W2_${safeName}_${timestamp}.zip`;
    const zipPath = path.join(outputDir, zipFilename);

    const zip = new AdmZip();
    zip.addFile(filename, pdfBytes);
    zip.writeZip(zipPath);

    // Save record to DB if user is logged in
    const userId = optionalUserId(req);
    if (userId) {
      try {
        await W2Record.create({
          userId,
          employerName: data.employerName,
          employerEIN: data.employerEIN,
          employeeFirstName: data.employeeFirstName,
          employeeLastName: data.employeeLastName,
          employeeSSN: data.employeeSSN,
          taxYear: data.taxYear || new Date().getFullYear().toString(),
          box1: data.box1,
          box2: data.box2,
          state1: data.state1,
          pdfFile: `public/${filename}`,
          zipFile: `public/${zipFilename}`,
          filename,
          paymentStatus: "success",
        });
      } catch (dbErr) {
        console.error("[W2 Wizard] DB save error:", dbErr.message);
      }
    }

    return res.json({
      success: true,
      pdfFile: `public/${filename}`,
      zipFile: `public/${zipFilename}`,
      filename,
    });
  } catch (err) {
    console.error("[W2 Wizard] Generate error:", err);
    return res.status(500).json({ error: err.message, success: false });
  }
});

// ─── Pre-fill W-2 from Paystub History ───────────────────────────────────────
// Aggregates all paid paystubs for a user, groups by employer+employee,
// re-computes per-period taxes, and returns W-2-ready totals.
router.get("/prefill-from-paystubs", async (req, res) => {
  try {
    const userId = optionalUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const Paystub = require("../models/Paystub");
    const {
      generateParams, convertDate, areDatesEqual, PAY_FREQUENCY,
      EMPLOYMENT_STATUS, formatNumber,
    } = require("../services/paystub.service");
    const STATE_TAX = require("../config/state-tax.json");
    const moment = require("moment");

    const SS_WAGE_BASE = 184500;

    const stubs = await Paystub.find({
      "params.userId": userId.toString(),
      "params.paymentStatus": "success",
    }).lean();

    if (!stubs.length) return res.json({ profiles: [] });

    // Group by normalized employer+employee key
    const groups = {};
    for (const stub of stubs) {
      const p = stub.params || {};
      const empName = (p.employee_name || "").trim().toLowerCase();
      const compName = (p.company_name || "").trim().toLowerCase();
      const key = `${compName}|||${empName}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(stub);
    }

    const taxYear = (req.query.year || new Date().getFullYear()).toString();

    const profiles = [];
    for (const [key, groupStubs] of Object.entries(groups)) {
      try {
        const latest = groupStubs[0];
        const p = latest.params || {};
        const days = PAY_FREQUENCY[p.pay_frequency] || 14;
        const empStatus = p.employment_status;
        const state = p.employee_state || "";
        const maritalStatus = p.maritial_status || "Single Taxpayers";

        // Accumulators for W-2 boxes
        let totalGross = 0;       // Box 1
        let totalFedTax = 0;      // Box 2
        let totalSSWages = 0;     // Box 3
        let totalSSTax = 0;       // Box 4
        let totalMedWages = 0;    // Box 5
        let totalMedTax = 0;      // Box 6
        let totalStateWages = 0;  // Box 16
        let totalStateTax = 0;    // Box 17
        let periodCount = 0;

        for (const stub of groupStubs) {
          const sp = stub.params || {};
          const payDates = Array.isArray(sp.pay_dates) ? sp.pay_dates : [];

          for (let idx = 0; idx < payDates.length; idx++) {
            const payDate = payDates[idx];
            // Filter by tax year
            const pd = moment(payDate, ["DD/MM/YYYY", "MM/DD/YYYY"]);
            if (!pd.isValid() || pd.year().toString() !== taxYear) continue;

            // Compute gross income for this period
            let income;
            if (empStatus === EMPLOYMENT_STATUS.Salary) {
              income = parseFloat(
                formatNumber((parseFloat(sp.annual_salary) / 365) * parseInt(days))
              );
            } else if (empStatus === EMPLOYMENT_STATUS.Hourly) {
              const hw = Array.isArray(sp.hours_worked) ? sp.hours_worked[idx] : sp.hours_worked;
              income = parseFloat(
                formatNumber(parseFloat(sp.hourly_rate || 0) * parseFloat(hw || 0))
              );
            } else {
              continue;
            }

            // Add additions for this period
            const additions = (sp.additions || []).filter((el) => {
              const ad = convertDate(el.payDate);
              const pdd = convertDate(payDate);
              return ad && pdd && areDatesEqual(ad, pdd);
            });
            const additionsTotal = additions.reduce((s, a) => s + parseFloat(a.amount || 0), 0);
            const grossIncome = income + additionsTotal;

            // Re-run tax calculations using same logic as paystub engine
            const computed = generateParams({
              income: formatNumber(income),
              state,
              maritial_status: maritalStatus,
              employee_hiring_date: sp.hire_date ? convertDate(sp.hire_date) : null,
              pay_date: convertDate(payDate),
              days,
              additions,
              deductions: (sp.deductions || []).filter((el) => {
                const dd = convertDate(el.payDate);
                const pdd = convertDate(payDate);
                return dd && pdd && areDatesEqual(dd, pdd);
              }),
              otherBenefits: (sp.otherBenefits || []).filter((el) => {
                const bd = convertDate(el.payDate);
                const pdd = convertDate(payDate);
                return bd && pdd && areDatesEqual(bd, pdd);
              }),
              check_number: "",
            });

            const periodGross = parseFloat(computed.gross_income || 0);
            // deductions_current = [federalTax, stateIncomeTax, sdiTax, medicareTax, ssTax, ...custom]
            const dc = computed.deductions_current || [];
            const fedTax = parseFloat(dc[0] || 0);
            const stateTax = parseFloat(dc[1] || 0);
            const medTax = parseFloat(dc[3] || 0);
            const ssTax = parseFloat(dc[4] || 0);

            totalGross += periodGross;
            totalFedTax += fedTax;
            totalMedWages += periodGross;
            totalMedTax += medTax;
            totalSSTax += ssTax;
            totalStateWages += periodGross;
            totalStateTax += stateTax;
            periodCount++;
          }
        }

        // Cap SS wages at wage base
        totalSSWages = Math.min(totalGross, SS_WAGE_BASE);

        if (periodCount === 0) continue;

        const stateCode = STATE_TAX[state]?.stateCode || "";

        // Parse employee name into first/last
        const nameParts = (p.employee_name || "").trim().split(/\s+/);
        const firstName = nameParts.slice(0, -1).join(" ") || nameParts[0] || "";
        const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";

        profiles.push({
          profileKey: key,
          // Employer info (W-2 Boxes b, c)
          employerEIN: (p.company_ein || "").replace(/-/g, ""),
          employerName: p.company_name || "",
          employerAddress1: [p.company_address, p.company_address_2].filter(Boolean).join(" "),
          employerCity: p.company_city || "",
          employerState: stateCode,
          employerZip: p.companyZipCode || "",
          // Employee info (W-2 Boxes a, e, f)
          employeeSSN: (p.ssid || "").replace(/X/g, "").replace(/-/g, ""),
          employeeFirstName: firstName,
          employeeLastName: lastName,
          employeeAddress1: [p.employee_address, p.employee_address_2].filter(Boolean).join(" "),
          employeeCity: p.employee_city || "",
          employeeState: stateCode,
          employeeZip: p.employeeZipCode || "",
          // Aggregated W-2 boxes
          box1: formatNumber(totalGross),
          box2: formatNumber(totalFedTax),
          box3: formatNumber(totalSSWages),
          box4: formatNumber(totalSSTax),
          box5: formatNumber(totalMedWages),
          box6: formatNumber(totalMedTax),
          state1: stateCode,
          stateWages1: formatNumber(totalStateWages),
          stateTax1: formatNumber(totalStateTax),
          // Meta
          taxYear,
          periodCount,
          payFrequency: p.pay_frequency || "",
          employmentStatus: empStatus || "",
          totalGross: formatNumber(totalGross),
        });
      } catch (groupErr) {
        console.error("[W2 Prefill] Error processing group:", key, groupErr.message);
      }
    }

    // Sort: most pay periods first
    profiles.sort((a, b) => b.periodCount - a.periodCount);
    return res.json({ profiles });
  } catch (err) {
    console.error("[W2 Prefill] Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ─── Get user's W-2 records ──────────────────────────────────────────────────
router.get("/my-w2s", async (req, res) => {
  try {
    const userId = optionalUserId(req);
    if (!userId) return res.status(401).json({ error: "Not authenticated" });
    const records = await W2Record.find({ userId }).sort({ createdAt: -1 }).lean();
    return res.json(records);
  } catch (err) {
    console.error("[W2 Wizard] my-w2s error:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
