const express = require("express");
const router = express.Router();
const { PDFDocument, rgb, degrees, StandardFonts } = require("pdf-lib");
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
  // Box c - Employer name, address, ZIP (all in one field)
  setText(`Col_Left[0].${f}_03[0]`, data.employerNameAndAddress);
  // Box d - Control number
  setText(`Col_Left[0].${f}_04[0]`, data.controlNumber);
  // Box e - Employee first name
  setText(`Col_Left[0].FirstName_ReadOrder[0].${f}_05[0]`, data.employeeFirstName);
  // Box e - Employee last name
  setText(`Col_Left[0].LastName_ReadOrder[0].${f}_06[0]`, data.employeeLastName);
  // Box e - Employee suffix (Jr., Sr., III, etc.)
  setText(`Col_Left[0].${f}_07[0]`, data.employeeSuffix);
  // Box f - Employee full address (street + city, state, ZIP)
  setText(`Col_Left[0].${f}_08[0]`, data.employeeFullAddress);

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

// ─── Generate W-2 PREVIEW (watermarked, Copy B only) ─────────────────────
router.post("/preview", async (req, res) => {
  try {
    const data = req.body;

    const employerAddr = [
      data.employerAddress1,
      data.employerAddress2,
      [data.employerCity, data.employerState, data.employerZip]
        .filter(Boolean)
        .join(", "),
    ]
      .filter(Boolean)
      .join("\n");

    const empCityStateZip = [data.employeeCity, data.employeeState, data.employeeZip]
      .filter(Boolean)
      .join(", ");

    // Box c: employer name + full address combined
    const employerNameAndAddress = [
      data.employerName,
      data.employerAddress1,
      data.employerAddress2,
      [data.employerCity, data.employerState, data.employerZip].filter(Boolean).join(", "),
    ].filter(Boolean).join("\n");

    // Employee full address: street + city/state/zip combined into one field
    const employeeFullAddress = [
      data.employeeAddress1,
      data.employeeAddress2,
      [data.employeeCity, data.employeeState, data.employeeZip].filter(Boolean).join(", "),
    ].filter(Boolean).join("\n");

    const fillData = {
      employeeSSN: data.employeeSSN || "",
      employerEIN: data.employerEIN || "",
      employerNameAndAddress: employerNameAndAddress,
      controlNumber: data.controlNumber || "",
      employeeFirstName: data.employeeFirstName || "",
      employeeLastName: data.employeeLastName || "",
      employeeSuffix: data.employeeSuffix || "",
      employeeFullAddress: employeeFullAddress,
      box1: data.box1 || "", box2: data.box2 || "",
      box3: data.box3 || "", box4: data.box4 || "",
      box5: data.box5 || "", box6: data.box6 || "",
      box7: data.box7 || "", box8: data.box8 || "",
      box9: data.box9 || "", box10: data.box10 || "",
      box11: data.box11 || "",
      box12aCode: data.box12aCode || "", box12aAmount: data.box12aAmount || "",
      box12bCode: data.box12bCode || "", box12bAmount: data.box12bAmount || "",
      box12cCode: data.box12cCode || "", box12cAmount: data.box12cAmount || "",
      box12dCode: data.box12dCode || "", box12dAmount: data.box12dAmount || "",
      statutoryEmployee: data.statutoryEmployee || false,
      retirementPlan: data.retirementPlan || false,
      thirdPartySickPay: data.thirdPartySickPay || false,
      box14Line1: data.box14Line1 || "", box14Line2: data.box14Line2 || "",
      box14Line3: data.box14Line3 || "",
      state1: data.state1 || "", employerStateId1: data.employerStateId1 || "",
      state2: data.state2 || "", employerStateId2: data.employerStateId2 || "",
      stateWages1: data.stateWages1 || "", stateWages2: data.stateWages2 || "",
      stateTax1: data.stateTax1 || "", stateTax2: data.stateTax2 || "",
      localWages1: data.localWages1 || "", localWages2: data.localWages2 || "",
      localTax1: data.localTax1 || "", localTax2: data.localTax2 || "",
      localityName1: data.localityName1 || "", localityName2: data.localityName2 || "",
    };

    // Load PDF template
    const templateBytes = fs.readFileSync(TEMPLATE_PATH);
    const pdfDoc = await PDFDocument.load(templateBytes, { ignoreEncryption: true });
    const form = pdfDoc.getForm();

    // Fill ALL 6 copies for preview
    for (const copy of COPIES) {
      fillCopy(form, copy, fillData);
    }

    // Flatten
    form.flatten();

    // Add PREVIEW watermarks centered over the W-2 form on every page
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const { width, height } = page.getSize();
      // W-2 form sits in the upper ~60% of each page
      const formCenterX = width / 2;
      const formCenterY = height * 0.55;

      // Large diagonal "PREVIEW" watermark — centered on form
      page.drawText("PREVIEW", {
        x: formCenterX - 140,
        y: formCenterY + 60,
        size: 80,
        font: helveticaBold,
        color: rgb(0.45, 0.45, 0.45),
        opacity: 0.22,
        rotate: degrees(-40),
      });

      // Second diagonal watermark — offset lower-left on form
      page.drawText("PREVIEW", {
        x: formCenterX - 200,
        y: formCenterY - 60,
        size: 80,
        font: helveticaBold,
        color: rgb(0.45, 0.45, 0.45),
        opacity: 0.18,
        rotate: degrees(-40),
      });

      // Third watermark — upper right area of form
      page.drawText("PREVIEW", {
        x: formCenterX + 20,
        y: formCenterY + 140,
        size: 60,
        font: helveticaBold,
        color: rgb(0.45, 0.45, 0.45),
        opacity: 0.14,
        rotate: degrees(-40),
      });

      // Top banner
      page.drawText("PREVIEW — NOT FOR FILING", {
        x: formCenterX - 100,
        y: height - 25,
        size: 14,
        font: helveticaBold,
        color: rgb(0.7, 0.15, 0.15),
        opacity: 0.7,
      });
    }

    const pdfBytes = await pdfDoc.save();

    // Save to public/ with preview prefix
    const timestamp = Date.now();
    const safeName = (data.employeeLastName || "w2").replace(/[^a-zA-Z0-9]/g, "");
    const filename = `W2_PREVIEW_${safeName}_${timestamp}.pdf`;
    const outputDir = path.join(__dirname, "..", "public");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(path.join(outputDir, filename), pdfBytes);

    // Auto-clean preview after 10 minutes
    setTimeout(() => {
      try { fs.unlinkSync(path.join(outputDir, filename)); } catch (_) {}
    }, 10 * 60 * 1000);

    return res.json({ success: true, previewFile: filename });
  } catch (err) {
    console.error("[W2 Wizard] Preview error:", err);
    return res.status(500).json({ error: err.message, success: false });
  }
});

// ─── Generate W-2 PDF ────────────────────────────────────────────────────
router.post("/generate", async (req, res) => {
  try {
    const data = req.body;

    // Box c: employer name + full address combined
    const employerNameAndAddress = [
      data.employerName,
      data.employerAddress1,
      data.employerAddress2,
      [data.employerCity, data.employerState, data.employerZip].filter(Boolean).join(", "),
    ].filter(Boolean).join("\n");

    // Employee full address: street + city/state/zip combined into one field
    const employeeFullAddress = [
      data.employeeAddress1,
      data.employeeAddress2,
      [data.employeeCity, data.employeeState, data.employeeZip].filter(Boolean).join(", "),
    ].filter(Boolean).join("\n");

    const fillData = {
      employeeSSN: data.employeeSSN || "",
      employerEIN: data.employerEIN || "",
      employerNameAndAddress: employerNameAndAddress,
      controlNumber: data.controlNumber || "",
      employeeFirstName: data.employeeFirstName || "",
      employeeLastName: data.employeeLastName || "",
      employeeSuffix: data.employeeSuffix || "",
      employeeFullAddress: employeeFullAddress,
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
    console.log("[W2 Wizard] Generate — userId:", userId, "auth header present:", !!req.headers.authorization);
    if (userId) {
      try {
        const rec = await W2Record.create({
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
          formData: data,
        });
        console.log("[W2 Wizard] DB save OK — record _id:", rec._id);
      } catch (dbErr) {
        console.error("[W2 Wizard] DB save error:", dbErr.message, dbErr.stack);
      }
    } else {
      console.warn("[W2 Wizard] No userId — W-2 will NOT be saved to dashboard");
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

// ─── EFW2 E-File Download ────────────────────────────────────────────────────
// Generates an EFW2-format text file (SSA specification) from a saved W-2 record.
// User can upload this file to SSA's Business Services Online (BSO) portal.

function pad(str, len, char = " ", right = false) {
  const s = String(str || "").substring(0, len);
  return right ? s.padEnd(len, char) : s.padStart(len, char);
}
function rpad(str, len) { return pad(str, len, " ", true); }
function lpad(str, len, char = "0") { return pad(str, len, char, false); }
function moneyField(val, len) {
  const cents = Math.round(parseFloat(val || 0) * 100);
  return lpad(String(cents), len, "0");
}
function cleanSSN(ssn) { return (ssn || "").replace(/\D/g, "").substring(0, 9).padEnd(9, "0"); }
function cleanEIN(ein) { return (ein || "").replace(/\D/g, "").substring(0, 9).padEnd(9, "0"); }

function buildEFW2(record, submitterInfo) {
  const d = record.formData || record;
  const taxYear = (d.taxYear || record.taxYear || new Date().getFullYear()).toString().substring(0, 4);
  const lines = [];

  // ─── RA Record: Submitter ───
  let ra = "RA";
  ra += cleanEIN(submitterInfo.ein || d.employerEIN);             // 3-11: Submitter EIN
  ra += rpad("", 8);                                               // 12-19: User ID (blank if not assigned)
  ra += rpad("", 4);                                               // 20-23: Software vendor code
  ra += rpad("", 5);                                               // 24-28: Blanks
  ra += "0";                                                       // 29: Resub indicator (0=original)
  ra += rpad("", 6);                                               // 30-35: Resub WFID
  ra += rpad("", 2);                                               // 36-37: Software code
  ra += rpad(submitterInfo.name || d.employerName, 57);            // 38-94: Submitter name
  ra += rpad(submitterInfo.address || d.employerAddress1 || "", 22); // 95-116: Street address
  ra += rpad(submitterInfo.city || d.employerCity || "", 22);      // 117-138: City
  ra += rpad(submitterInfo.state || d.employerState || "", 2);     // 139-140: State
  ra += rpad(submitterInfo.zip || d.employerZip || "", 5);         // 141-145: ZIP
  ra += rpad("", 4);                                               // 146-149: ZIP ext
  ra += rpad("", 23);                                              // 150-172: Blanks
  ra += rpad(submitterInfo.name || d.employerName, 57);            // 173-229: Contact name
  ra += rpad(submitterInfo.phone || "", 15);                       // 230-244: Contact phone
  ra += rpad(submitterInfo.phoneExt || "", 5);                     // 245-249: Phone ext
  ra += rpad("", 3);                                               // 250-252: Blanks
  ra += rpad(submitterInfo.email || "", 40);                       // 253-292: Contact email
  ra += rpad("", 3);                                               // 293-295: Blanks
  ra += rpad("", 10);                                              // 296-305: Contact fax
  ra += rpad("", 1);                                               // 306: Blanks
  ra += "L";                                                       // 307: Preparer code (L=self-prepared)
  ra += rpad("", 205);                                             // 308-512: Blanks
  lines.push(ra);

  // ─── RE Record: Employer ───
  let re = "RE";
  re += taxYear;                                                   // 3-6: Tax year
  re += " ";                                                       // 7: Agent indicator
  re += cleanEIN(d.employerEIN);                                   // 8-16: Employer EIN
  re += rpad("", 9);                                               // 17-25: Agent EIN
  re += " ";                                                       // 26: Terminating business
  re += rpad("", 4);                                               // 27-30: Establishment number
  re += rpad("", 9);                                               // 31-39: Other EIN
  re += rpad(d.employerName || "", 57);                            // 40-96: Employer name
  re += rpad("", 57);                                              // 97-153: Location address
  re += rpad(d.employerAddress1 || "", 22);                        // 154-175: Delivery address
  re += rpad(d.employerCity || "", 22);                            // 176-197: City
  re += rpad(d.employerState || "", 2);                            // 198-199: State
  re += rpad(d.employerZip || "", 5);                              // 200-204: ZIP
  re += rpad("", 4);                                               // 205-208: ZIP ext
  re += rpad("K", 1);                                              // 209: Kind of employer (K=none apply)
  re += rpad("", 4);                                               // 210-213: Blanks
  re += rpad("", 9);                                               // 214-222: Foreign zip/postal
  re += rpad("", 2);                                               // 223-224: Country code
  re += rpad("", 1);                                               // 225: Employment code (R=regular)
  re += "0";                                                       // 226: Tax jurisdiction (0=all)
  re += " ";                                                       // 227: Third party sick pay
  re += rpad("", 285);                                             // 228-512: Blanks
  lines.push(re);

  // ─── RW Record: Employee Wage ───
  let rw = "RW";
  rw += cleanSSN(d.employeeSSN);                                   // 3-11: SSN
  rw += rpad(d.employeeFirstName || "", 15);                       // 12-26: First name
  rw += rpad("", 15);                                              // 27-41: Middle name
  rw += rpad(d.employeeLastName || "", 20);                        // 42-61: Last name
  rw += rpad(d.employeeSuffix || "", 4);                           // 62-65: Suffix
  rw += rpad(d.employeeAddress1 || "", 22);                        // 66-87: Location address
  rw += rpad(d.employeeAddress1 || "", 22);                        // 88-109: Delivery address
  rw += rpad(d.employeeCity || "", 22);                            // 110-131: City
  rw += rpad(d.employeeState || "", 2);                            // 132-133: State
  rw += rpad(d.employeeZip || "", 5);                              // 134-138: ZIP
  rw += rpad("", 4);                                               // 139-142: ZIP ext
  rw += rpad("", 5);                                               // 143-147: Blanks
  rw += rpad("", 23);                                              // 148-170: Foreign state/province, zip, country
  rw += moneyField(d.box1, 11);                                   // 171-181: Wages (Box 1)
  rw += moneyField(d.box2, 11);                                   // 182-192: Federal tax (Box 2)
  rw += moneyField(d.box3, 11);                                   // 193-203: SS wages (Box 3)
  rw += moneyField(d.box4, 11);                                   // 204-214: SS tax (Box 4)
  rw += moneyField(d.box5, 11);                                   // 215-225: Medicare wages (Box 5)
  rw += moneyField(d.box6, 11);                                   // 226-236: Medicare tax (Box 6)
  rw += moneyField(d.box7, 11);                                   // 237-247: SS tips (Box 7)
  rw += moneyField(0, 11);                                        // 248-258: Advance EIC
  rw += moneyField(d.box10, 11);                                  // 259-269: Dependent care (Box 10)
  rw += moneyField(0, 11);                                        // 270-280: Deferred comp 401k
  rw += moneyField(0, 11);                                        // 281-291: Deferred comp 403b
  rw += moneyField(0, 11);                                        // 292-302: Deferred comp 408k
  rw += moneyField(0, 11);                                        // 303-313: Deferred comp 457b
  rw += moneyField(0, 11);                                        // 314-324: Deferred comp 501c
  rw += rpad("", 1);                                               // 325: Blank
  rw += moneyField(d.box11, 11);                                  // 326-336: Nonqualified plans (Box 11)
  rw += moneyField(0, 11);                                        // 337-347: HSA
  rw += moneyField(0, 11);                                        // 348-358: Non-qual 457
  rw += moneyField(0, 11);                                        // 359-369: Non-qual NOT 457
  rw += moneyField(0, 11);                                        // 370-380: Nontaxable combat pay
  rw += rpad("", 12);                                              // 381-392: Blanks
  rw += moneyField(0, 11);                                        // 393-403: Roth 401k
  rw += moneyField(0, 11);                                        // 404-414: Roth 403b
  rw += moneyField(d.box8, 11);                                   // 415-425: Allocated tips (Box 8)
  rw += rpad("", 1);                                               // 426: Blank
  // Box 13 checkboxes
  rw += d.statutoryEmployee ? "1" : "0";                           // 427: Statutory employee
  rw += "0";                                                       // 428: Deceased (not tracked)
  rw += "0";                                                       // 429: Pension plan (not tracked)
  rw += "0";                                                       // 430: Legal rep (not tracked)
  rw += d.retirementPlan ? "1" : "0";                              // 431: Retirement plan
  rw += d.thirdPartySickPay ? "1" : "0";                           // 432: Third party sick pay
  rw += rpad("", 80);                                              // 433-512: Blanks
  lines.push(rw);

  // ─── RS Record: State Wage (if state data present) ───
  if (d.state1) {
    let rs = "RS";
    rs += rpad(d.state1 || "", 2);                                  // 3-4: State code (alpha)
    rs += rpad("", 2);                                              // 5-6: Tax entity code
    rs += cleanSSN(d.employeeSSN);                                  // 7-15: SSN
    rs += rpad(d.employeeFirstName || "", 15);                      // 16-30: First name
    rs += rpad("", 15);                                             // 31-45: Middle name
    rs += rpad(d.employeeLastName || "", 20);                       // 46-65: Last name
    rs += rpad(d.employeeSuffix || "", 4);                          // 66-69: Suffix
    rs += rpad(d.employeeAddress1 || "", 22);                       // 70-91: Location address
    rs += rpad(d.employeeAddress1 || "", 22);                       // 92-113: Delivery address
    rs += rpad(d.employeeCity || "", 22);                           // 114-135: City
    rs += rpad(d.employeeState || "", 2);                           // 136-137: State
    rs += rpad(d.employeeZip || "", 5);                             // 138-142: ZIP
    rs += rpad("", 4);                                              // 143-146: ZIP ext
    rs += rpad("", 5);                                              // 147-151: Blanks
    rs += rpad("", 23);                                             // 152-174: Foreign data
    rs += rpad("", 2);                                              // 175-176: Optional code
    rs += rpad("", 6);                                              // 177-182: Reporting period
    rs += moneyField(d.stateWages1, 11);                           // 183-193: State wages
    rs += moneyField(d.stateTax1, 11);                             // 194-204: State tax
    rs += rpad("", 10);                                             // 205-214: Other state data
    rs += rpad("", 1);                                              // 215: Tax type code
    rs += moneyField(d.localWages1, 11);                           // 216-226: Local wages
    rs += moneyField(d.localTax1, 11);                             // 227-237: Local tax
    rs += rpad(d.employerStateId1 || "", 20);                       // 238-257: State control number
    rs += rpad("", 255);                                            // 258-512: Blanks
    lines.push(rs);
  }

  // ─── RT Record: Total (one employee) ───
  let rt = "RT";
  rt += lpad("1", 7, "0");                                        // 3-9: Number of RW records
  rt += moneyField(d.box1, 15);                                   // 10-24: Total wages
  rt += moneyField(d.box2, 15);                                   // 25-39: Total fed tax
  rt += moneyField(d.box3, 15);                                   // 40-54: Total SS wages
  rt += moneyField(d.box4, 15);                                   // 55-69: Total SS tax
  rt += moneyField(d.box5, 15);                                   // 70-84: Total Medicare wages
  rt += moneyField(d.box6, 15);                                   // 85-99: Total Medicare tax
  rt += moneyField(d.box7, 15);                                   // 100-114: Total SS tips
  rt += moneyField(0, 15);                                        // 115-129: Advance EIC
  rt += moneyField(d.box10, 15);                                  // 130-144: Dependent care
  rt += moneyField(0, 15);                                        // 145-159: 401k
  rt += moneyField(0, 15);                                        // 160-174: 403b
  rt += moneyField(0, 15);                                        // 175-189: 408k
  rt += moneyField(0, 15);                                        // 190-204: 457b
  rt += moneyField(0, 15);                                        // 205-219: 501c
  rt += rpad("", 15);                                              // 220-234: Blanks
  rt += moneyField(d.box11, 15);                                  // 235-249: Nonqualified
  rt += moneyField(0, 15);                                        // 250-264: HSA
  rt += moneyField(0, 15);                                        // 265-279: Non-qual 457
  rt += moneyField(0, 15);                                        // 280-294: Non-qual NOT 457
  rt += moneyField(0, 15);                                        // 295-309: Combat pay
  rt += rpad("", 15);                                              // 310-324: Blanks
  rt += moneyField(0, 15);                                        // 325-339: Roth 401k
  rt += moneyField(0, 15);                                        // 340-354: Roth 403b
  rt += rpad("", 158);                                             // 355-512: Blanks
  lines.push(rt);

  // ─── RU Record: State Total (if state data present) ───
  if (d.state1) {
    let ru = "RU";
    ru += lpad("1", 7, "0");                                       // 3-9: Number of RS records
    ru += rpad("", 15);                                             // 10-24: Blanks
    ru += rpad("", 15);                                             // 25-39: Blanks
    ru += rpad("", 15);                                             // 40-54: Blanks
    ru += rpad("", 15);                                             // 55-69: Blanks
    ru += moneyField(d.stateWages1, 15);                           // 70-84: Total state wages
    ru += moneyField(d.stateTax1, 15);                             // 85-99: Total state tax
    ru += rpad("", 413);                                            // 100-512: Blanks
    lines.push(ru);
  }

  // ─── RF Record: Final ───
  let rf = "RF";
  rf += lpad("1", 9, "0");                                        // 3-11: Number of RW records total
  rf += rpad("", 501);                                             // 12-512: Blanks
  lines.push(rf);

  return lines.join("\r\n") + "\r\n";
}

router.get("/efile/:id", async (req, res) => {
  try {
    // Support token via query param (for window.open) or Authorization header
    let userId = optionalUserId(req);
    if (!userId && req.query.token) {
      try {
        const decoded = jwt.verify(req.query.token, process.env.JWT_SECRET);
        userId = decoded?.payload?.user || null;
      } catch (_) {}
    }
    if (!userId) return res.status(401).json({ error: "Not authenticated" });

    const record = await W2Record.findOne({ _id: req.params.id, userId }).lean();
    if (!record) return res.status(404).json({ error: "W-2 record not found" });

    const d = record.formData || record;
    const submitterInfo = {
      ein: d.employerEIN || record.employerEIN,
      name: d.employerName || record.employerName,
      address: d.employerAddress1 || "",
      city: d.employerCity || "",
      state: d.employerState || "",
      zip: d.employerZip || "",
      phone: "",
      email: "",
    };

    const efw2Content = buildEFW2(record, submitterInfo);
    const safeName = (record.employeeLastName || "W2").replace(/[^a-zA-Z0-9]/g, "");
    const filename = `W2_EFILE_${safeName}_${record.taxYear || "2025"}.txt`;

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.send(efw2Content);
  } catch (err) {
    console.error("[W2 Wizard] E-file error:", err);
    return res.status(500).json({ error: err.message });
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
