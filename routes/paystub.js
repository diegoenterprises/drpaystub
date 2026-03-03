const express = require("express");
const router = express.Router();
const moment = require("moment");
const ejs = require("ejs");
require("dotenv").config();
const { STRIPE_LIVE_KEY, STRIPE_TEST_KEY, STRIPE_MODE } = process.env;
const stripeKey = STRIPE_MODE === "dev" ? STRIPE_TEST_KEY : STRIPE_LIVE_KEY;
const stripe = require("stripe")(stripeKey);
const { logo: watermark } = require("../config/logo");
// Playwright-based rendering is handled in services/pdf-generator.js
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const { upload, zipFiles } = require("../utils");
const {
  createHighResImage,
  generateSecurePDF,
  injectSecurityCSS,
  fixFontReferences,
  generateDocumentHash,
} = require("../services/pdf-generator-pdfkit");
const {
  getComputedString,
  generateParams,
  convertDate,
  areDatesEqual,
  PAY_FREQUENCY,
  getPaystubDTO,
  EMPLOYMENT_STATUS,
  formatNumber,
} = require("../services/paystub.service");

const { sendEmail, sendPaystubPDFs } = require("../services/email.service");
const jwt = require("jsonwebtoken");

const Paystub = require("../models/Paystub");

// Helper: extract userId from JWT if present (no auth required)
function optionalUserId(req) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;
    const token = authHeader.split(" ")[1];
    if (!token) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded?.payload?.user || null;
  } catch { return null; }
}

const createImage = async (imageFilePath, paramsOrHtml, template) => {
  const outputPath = `./public/${imageFilePath}`;
  await createHighResImage(outputPath, paramsOrHtml, template);
};

router.post("/getZip", async (req, res, next) => {
  try {
    const { paystubId, template } = req.body;

    const paystub = await Paystub.findById(paystubId);
    const params_old = paystub.params;

    // Link userId from JWT if paystub doesn't have one yet
    const jwtUserId = optionalUserId(req);
    const updateFields = { "params.paymentStatus": "success", "params.template": template };
    if (jwtUserId && !paystub.params?.userId) {
      updateFields["params.userId"] = jwtUserId;
    }

    const pay = await Paystub.findByIdAndUpdate(
      { _id: paystubId },
      updateFields,
      { new: true }
    );

    const {
      ssid,
      emailAddress,
      maritial_status,
      employee_Id,
      employment_status,
      employee_name,
      employee_address,
      employee_address_2,
      employee_city,
      employee_state,
      employeeZipCode,
      hourly_rate,
      hours_worked,
      annual_salary,
      pay_frequency,
      EmployeeHiredIn2021,
      company_name,
      company_phone,
      company_ein,
      company_address,
      company_address_2,
      company_city,
      company_state,
      companyZipCode,
      hire_date,
      pay_dates,
      check_numbers,
      additions,
      deductions,
      company_notes,
      bankNumber,
      routingNumber,
      manager,
      otherBenefits,
      sign,
      bank_name,
      bank_street_address,
      bank_city,
      bank_state,
      bank_zip,
      company_image,
      startDate,
      actual_pay_dates,
      company_website,
    } = params_old;

    let days = PAY_FREQUENCY[pay_frequency];

    let params = {
      watermark,
      state: employee_state,
      ssid,
      employee_Id,
      employee_name,
      employee_address: getComputedString({
        address: employee_address,
        address2: employee_address_2,
        state: employee_state,
        city: employee_city,
        zipCode: employeeZipCode,
      }),
      company_name,
      company_address: getComputedString({
        address: company_address,
        address2: company_address_2,
        state: company_state,
        city: company_city,
        zipCode: companyZipCode,
      }),
      company_image:
        company_image && `/${company_image.originalname}`,
      company_phone,
      company_ein,
      hourly_rate,
      hours_worked,
      date: moment().format("MMMM D, YYYY"),
      net_pay_english: "",
      earnings_labels: [],
      income: [],
      deduction_labels: [],
      deductions_current: [],
      deduction_ytd: [],
      ytd_gross: 0,
      ytd_deductions: 0,
      ytd_netPay: 0,
      currentTotal: 0,
      currentDeductions: 0,
      template: pay.template,
      net_pay: 0,
      company_notes,
      company_ein,
      bankNumber,
      routingNumber,
      manager,
      sign,
      bank_name,
      bank_street_address,
      bank_city,
      bank_state,
      bank_zip,
      startDate,
      actual_pay_dates,
      company_website,
    };

    let ejsTempalte = `paystub-${template}.ejs`;
    let fileContent = fs.readFileSync(
      path.join(__dirname, "../", "views", ejsTempalte),
      {
        encoding: "utf-8",
      }
    );

    let response = [];
    let index = 0;
    const passwordDetails = [];

    // loop start from here
    var filename = "";
    for await (const payDate of pay_dates) {
      let _income;
      if (employment_status === EMPLOYMENT_STATUS.Salary) {
        _income = formatNumber(
          (parseFloat(annual_salary) / 365) * parseInt(days)
        );
      } else if (employment_status === EMPLOYMENT_STATUS.Hourly) {
        _income = formatNumber(
          parseFloat(hourly_rate) * parseFloat(hours_worked[index])
        );
      } else {
        throw new Error("Invalid Employment Status");
      }

      params = {
        ...params,
        ...generateParams({
          additions: (additions || []).filter((el) =>
            areDatesEqual(convertDate(el.payDate), convertDate(payDate))
          ),
          deductions: (deductions || []).filter((el) =>
            areDatesEqual(convertDate(el.payDate), convertDate(payDate))
          ),
          otherBenefits: (otherBenefits || []).filter((el) =>
            areDatesEqual(convertDate(el.payDate), convertDate(payDate))
          ),
          income: _income,
          state: employee_state,
          maritial_status,
          employee_hiring_date: EmployeeHiredIn2021
            ? convertDate(hire_date)
            : null,
          pay_date: convertDate(payDate),
          days,
          check_number: check_numbers[index],
        }),
      };
      let start_date = startDate;
      if (index !== 0) {
        start_date = moment(pay_dates[index - 1], "DD/MM/YYYY").format(
          "MM/DD/YYYY"
        );
      }
      params.startDate = start_date;
      params.actualPayDate = moment(
        actual_pay_dates[index],
        "DD/MM/YYYY"
      ).format("MM/DD/YYYY");
      params.hourly_rate = null;
      params.hours_worked = null;
      if (employment_status === EMPLOYMENT_STATUS.Hourly) {
        params.hourly_rate = hourly_rate;
        params.hours_worked = hours_worked[index];
      }

      // ── Compute per-stub password: LASTNAME + LAST4SSN + MMDDYYYY ──
      const nameParts = (employee_name || "").trim().split(/\s+/);
      const lastName = (nameParts[nameParts.length - 1] || "").toUpperCase();
      const ssnDigits = (ssid || "").replace(/\D/g, "");
      const last4SSN = ssnDigits.slice(-4);
      const dateForPwd = (params.startDate || "").replace(/\//g, "");
      const stubPassword = lastName + last4SSN + dateForPwd;

      const getTemplate = new Promise(async (res, rej) => {
        let name = company_name.split(" ").join("-").toLowerCase();
        const date = new Date();
        const unique = Math.floor(10000 + Math.random() * 90000);
        filename = `${name}-payroll-${
          date.getMonth() + 1
        }-${date.getFullYear()}-${unique}`;

        let imageFilePath = `${filename}-${template}.pdf`;
        for (let i = 0; i < 5; i++) {
          await createImage(imageFilePath, params, template);
          try {
            if (fs.existsSync(`./public/${imageFilePath}`)) {
              break;
            }
          } catch (err) {}
        }

        let pdfFilename = `${filename}-${template}.pdf`;
        let pdfFilePath = `public/${pdfFilename}`;

        // Snappt-hardened PDF generation with metadata, text layer, permissions + user password
        const pdfParams = {
          ...params,
          _generationTimestamp: Date.now(),
        };
        await generateSecurePDF(
          path.join(__dirname, "../", "public", imageFilePath),
          pdfFilePath,
          pdfParams,
          { template: template, userPassword: stubPassword }
        );
        res(pdfFilename);
      });
      const temp = await getTemplate;

      // Collect password detail for this stub (for email)
      passwordDetails.push({
        payPeriodStart: params.startDate,
        actualPayDate: params.actualPayDate,
        password: stubPassword,
      });

      index++;

      response.push(temp);
    }
    const paths = response.map((i) => `public/${i}`);
    const zipSrc = await zipFiles({
      pathNames: paths,
      zipFileName: `public/${filename}.zip`,
    });

    // Email PDFs as attachments via Azure Communication Services (with password info)
    sendPaystubPDFs(emailAddress, employee_name, paths, passwordDetails);

    res.json({
      zipSrc: zipSrc,
      success: true,
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
});

// ─── Test Email Endpoint (full diagnostic) ───────────────────────────────────
router.get("/test-email", async (req, res) => {
  const testTo = req.query.to;
  if (!testTo) return res.json({ error: "Provide ?to=email@example.com" });
  try {
    const { EmailClient } = require("@azure/communication-email");
    const connStr = process.env.AZURE_EMAIL_CONNECTION_STRING || "";
    const fromEmail = process.env.FROM_EMAIL || "noreply@drpaystub.net";

    if (!connStr) return res.json({ success: false, error: "No AZURE_EMAIL_CONNECTION_STRING" });

    const client = new EmailClient(connStr);
    const message = {
      senderAddress: fromEmail,
      content: {
        subject: "Saurellius Email Test",
        html: "<h1>Test</h1><p>If you see this, email delivery works from <b>" + fromEmail + "</b>.</p>",
        plainText: "Test email from " + fromEmail,
      },
      recipients: { to: [{ address: testTo }] },
    };

    console.log("[Email Test] Sending from:", fromEmail, "to:", testTo);
    const poller = await client.beginSend(message);
    const result = await poller.pollUntilDone();
    console.log("[Email Test] Full result:", JSON.stringify(result));

    res.json({
      success: result.status === "Succeeded",
      from: fromEmail,
      to: testTo,
      status: result.status,
      id: result.id,
      error: result.error || null,
    });
  } catch (err) {
    console.error("[Email Test] Exception:", err);
    res.json({
      success: false,
      error: err.message,
      code: err.code,
      statusCode: err.statusCode,
      details: err.details,
    });
  }
});

router.post("/save-stub", upload.single("company_image"), async (req, res) => {
  const parsedRequestBody = JSON.parse(req.body.params);

  // Link paystub to authenticated user (JWT is authoritative, localStorage fallback)
  const jwtUserId = optionalUserId(req);
  if (jwtUserId) {
    parsedRequestBody.userId = jwtUserId;
  } else if (!parsedRequestBody.userId) {
    parsedRequestBody.userId = null;
  }

  const company_image = req.file || null;
  parsedRequestBody.company_image = company_image;

  let errors = getPaystubDTO(parsedRequestBody);

  if (Object.keys(errors).length) {
    return res.json({
      message: errors,
      status: false,
    });
  }
  const paystub = await Paystub.create({
    params: parsedRequestBody
  });
  return res.json({ status: true, paystub });
});

router.post("/templates", async (req, res) => {
  try {
    const { paystubId, template } = req.body;

    const paystub = await Paystub.findById(paystubId);
    const params_old = paystub.params;

    const {
      ssid,
      maritial_status,
      employee_Id,
      employment_status,
      employee_name,
      employee_address,
      employee_address_2,
      employee_city,
      employee_state,
      employeeZipCode,
      hourly_rate,
      hours_worked,
      annual_salary,
      pay_frequency,
      EmployeeHiredIn2021,
      company_name,
      company_phone,
      company_ein,
      company_address,
      company_address_2,
      company_city,
      company_state,
      companyZipCode,
      hire_date,
      pay_dates,
      actual_pay_dates,
      check_numbers,
      additions,
      deductions,
      company_notes,
      bankNumber,
      routingNumber,
      manager,
      otherBenefits,
      sign,
      bank_name,
      bank_street_address,
      bank_city,
      bank_state,
      bank_zip,
      company_image,
      startDate,
      company_website,
    } = params_old;

    let days = PAY_FREQUENCY[pay_frequency];

    let params = {
      watermark,
      state: employee_state,
      ssid,
      employee_Id,
      employee_name,
      employee_address: getComputedString({
        address: employee_address,
        address2: employee_address_2,
        state: employee_state,
        city: employee_city,
        zipCode: employeeZipCode,
      }),
      company_name,
      company_address: getComputedString({
        address: company_address,
        address2: company_address_2,
        state: company_state,
        city: company_city,
        zipCode: companyZipCode,
      }),
      company_image:
        company_image && `/${company_image.originalname}`,
      company_phone,
      company_ein,
      hourly_rate,
      hours_worked,
      date: moment().format("MMMM D, YYYY"),
      net_pay_english: "",
      earnings_labels: [],
      income: [],
      deduction_labels: [],
      deductions_current: [],
      deduction_ytd: [],
      ytd_gross: 0,
      ytd_deductions: 0,
      ytd_netPay: 0,
      currentTotal: 0,
      currentDeductions: 0,
      net_pay: 0,
      company_notes,
      company_ein,
      bankNumber,
      routingNumber,
      manager,
      sign,
      bank_name,
      bank_street_address,
      bank_city,
      bank_state,
      bank_zip,
      startDate,
      actual_pay_dates,
      company_website,
    };

    let ejsTempalte = `paystub-${template}.ejs`;
    let fileContent = fs.readFileSync(
      path.join(__dirname, "../", "views", ejsTempalte),
      {
        encoding: "utf-8",
      }
    );

    let response = [];
    let index = 0;

    // loop start from here

    for await (const payDate of pay_dates) {
      let _income;
      if (employment_status === EMPLOYMENT_STATUS.Salary) {
        _income = formatNumber(
          (parseFloat(annual_salary) / 365) * parseInt(days)
        );
      } else if (employment_status === EMPLOYMENT_STATUS.Hourly) {
        _income = formatNumber(
          parseFloat(hourly_rate) * parseFloat(hours_worked[index])
        );
      } else {
        throw new Error("Invalid Employment Status");
      }

      params = {
        ...params,
        ...generateParams({
          additions: (additions || []).filter((el) =>
            areDatesEqual(convertDate(el.payDate), convertDate(payDate))
          ),
          deductions: (deductions || []).filter((el) =>
            areDatesEqual(convertDate(el.payDate), convertDate(payDate))
          ),
          otherBenefits: (otherBenefits || []).filter((el) =>
            areDatesEqual(convertDate(el.payDate), convertDate(payDate))
          ),
          income: _income,
          state: employee_state,
          maritial_status,
          employee_hiring_date: EmployeeHiredIn2021
            ? convertDate(hire_date)
            : null,
          pay_date: convertDate(payDate),
          days,
          check_number: check_numbers[index],
        }),
      };
      let start_date = startDate;
      if (index !== 0) {
        start_date = moment(pay_dates[index - 1], "DD/MM/YYYY").format(
          "MM/DD/YYYY"
        );
      }
      params.startDate = start_date;
      params.actualPayDate = moment(
        actual_pay_dates[index],
        "DD/MM/YYYY"
      ).format("MM/DD/YYYY");
      params.hourly_rate = null;
      params.hours_worked = null;
      if (employment_status === EMPLOYMENT_STATUS.Hourly) {
        params.hourly_rate = hourly_rate;
        params.hours_worked = hours_worked[index];
      }

      let watemarkImageFilePath = `paystub-${Date.now()}-${template}.pdf`;

      for (let i = 0; i < 5; i++) {
        await createImage(watemarkImageFilePath, params, template);
        try {
          if (fs.existsSync(`./public/${watemarkImageFilePath}`)) {
            break;
          }
        } catch (err) {}
      }

      response.push(watemarkImageFilePath);
      index++;
    }

    res.json({
      templates: response,
      success: true,
    });
  } catch (e) {
    console.error("[Templates] Error generating template " + template + ":", e.message);
    res.json({
      message: e.message,
      success: false,
    });
  }
});

router.get("/payment-intent", async (req, res, next) => {
  try {
    const basePrice = 2000; // $20.00 in cents
    const discount = req.query.discount === "100" ? 1 : 0;
    const rawAmount = parseInt(req.query.amount, 10);
    const finalAmount = discount ? 0 : (rawAmount > 0 ? rawAmount * 100 : basePrice);

    if (finalAmount === 0) {
      return res.json({ secret: "free_owner_access", free: true });
    }

    console.log("[Stripe] Creating payment intent for $" + (finalAmount / 100).toFixed(2));
    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency: "usd",
      payment_method_types: ["card"],
      statement_descriptor_suffix: "Saurellius",
    });
    console.log("[Stripe] Payment intent created:", paymentIntent.id);
    return res.json({ secret: paymentIntent.client_secret, free: false });
  } catch (err) {
    console.error("[Stripe] Payment intent error:", err.message);
    return res.status(500).json({ error: err.message, secret: null, free: false });
  }
});

router.get("/new", async (req, res, next) => {
  const parsedRequestBodyOld2 = {
    company_name: "Esferasoft",
    company_address: "Plot f5-f6",
    company_address_2: "Phase 8",
    company_city: "Mohali",
    company_state: "CALIFORNIA",
    companyZipCode: "45210",
    company_phone: "88727172",
    company_ein: "21-8778524",
    emailAddress: "company@yopmail.com",
    employment_status: "Salary",
    employee_name: "Esfera company",
    employee_address: "#2116",
    employee_address_2: "Sector 71 ",
    employee_city: "Mohali",
    employee_state: "CALIFORNIA",
    employeeZipCode: "16005",
    employee_Id: "12345",
    maritial_status: "Single Taxpayers",
    noOfDependants: "2",
    blindExemptions: "3",
    ssid: "XXX-XX-1234",
    annual_salary: "5000",
    pay_frequency: "Semi-Anually",
    check_number: "123123",
    currentAmount: "400",
    ytdAmount: "1200",
    description2: "Tuition",
    payDate3: "apply-to-all",
    ytdAmount2: "1200",
    check_numbers: ["123412", "123123"],
    pay_dates: ["19/08/2022", "19/02/2022"],
    hire_date: "27/02/2023",
    EmployeeHiredIn2021: false,
    additions: [
      {
        description: "Overtime",
        amount: "900",
        payDate: "19/08/2022",
        ytdAmount: "1000",
      },
      {
        description: "Overtime",
        amount: "900",
        payDate: "19/02/2022",
        ytdAmount: "1000",
      },
      {
        description: "Fruits",
        amount: "400",
        payDate: "19/08/2022",
        ytdAmount: "1200",
      },
      {
        description: "Fruits",
        amount: "400",
        payDate: "19/02/2022",
        ytdAmount: "1200",
      },
    ],
    deductions: [
      {
        description: "Tuition",
        amount: "200",
        payDate: "19/08/2022",
        ytdAmount: "1200",
      },
      {
        description: "Tuition",
        amount: "200",
        payDate: "19/02/2022",
        ytdAmount: "1200",
      },
    ],
    company_notes: "Yo yo yo yo",
  };

  const parsedRequestBodyOld = {
    company_name: "Raftu",
    company_address: "#13",
    company_address_2: "Babu school",
    company_city: "Mohali",
    company_state: "",
    companyZipCode: "",
    company_phone: "123441232",
    company_ein: "33-3412312",
    emailAddress: "coco@yopmail.com",
    employment_status: "Hourly",
    employee_name: "Akhil sharma",
    employee_address: "#145,",
    employee_address_2: "Phase 8 ",
    employee_city: "Punjab",
    employee_state: "IOWA",
    employeeZipCode: "12121",
    employee_Id: "123123",
    maritial_status: "Single Taxpayers",
    noOfDependants: "",
    blindExemptions: "",
    ssid: "XXX-XX-1234",
    hourly_rate: "20",
    pay_frequency: "Weekly",
    hours_worked_per_payPeriod: "12",
    check_number: "321123",
    pay_dates: ["21/02/2023", "14/02/2023"],
    hire_date: "28/02/2023",
    EmployeeHiredIn2021: false,
    additions: [],
    deductions: [],
    check_numbers: ["123123", "321123"],
    hours_worked: ["12", "31"],
  };

  const parsedRequestBody = {
    company_name: "VVV",
    company_address: "",
    company_address_2: "",
    company_city: "",
    company_state: "KANSAS",
    companyZipCode: "",
    company_phone: "",
    company_ein: "",
    emailAddress: "vikarm@yopmail.com",
    bankNumber: "",
    routingNumber: "",
    manager: "",
    employment_status: "Hourly",
    employee_name: "ACME SUPPLIES CORP",
    employee_address: "475 KNAPP AVENUE",
    employee_address_2: "",
    employee_city: "",
    employee_state: "LOUISIANA",
    employeeZipCode: "",
    employee_Id: "",
    maritial_status: "Single Taxpayers",
    noOfDependants: "",
    blindExemptions: "",
    ssid: "XXX-XX-1221",
    hourly_rate: "11",
    pay_frequency: "Daily",
    hours_worked_per_payPeriod: "",
    check_number: "123",
    pay_dates: ["09/03/2023"],
    actual_pay_dates: ["14/03/2023"],
    startDate: "12/03/2023",
    hire_date: "10/03/2023",
    EmployeeHiredIn2021: false,
    additions: [],
    deductions: [],
    otherBenefits: [],
    check_numbers: ["123"],
    hours_worked: ["11"],
    company_notes: "ii",
    bank_name: "Axis Bank",
    bank_street_address: "Kaithal Road",
    bank_city: "Pehowa",
    bank_state: "Chandigarh",
    bank_zip: "90192",
    sign: "data:image/png;base64,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",
  };

  const {
    ssid,
    maritial_status,
    employee_Id,
    employment_status,
    employee_name,
    employee_address,
    employee_address_2,
    employee_city,
    employee_state,
    employeeZipCode,
    hourly_rate,
    hours_worked,
    annual_salary,
    pay_frequency,
    EmployeeHiredIn2021,
    company_name,
    company_phone,
    company_ein,
    company_address,
    company_address_2,
    company_city,
    company_state,
    companyZipCode,
    hire_date,
    pay_dates,
    check_numbers,
    additions,
    deductions,
    company_notes,
    bankNumber,
    routingNumber,
    manager,
    otherBenefits,
    sign,
    bank_name,
    bank_street_address,
    bank_city,
    bank_state,
    bank_zip,
    startDate,
    actual_pay_dates,
  } = parsedRequestBody;

  // const company_image = req.file || null;

  let errors = getPaystubDTO(parsedRequestBody);

  if (Object.keys(errors).length) {
    return res.json({
      errors,
      success: false,
    });
  }

  let days = PAY_FREQUENCY[pay_frequency];

  let params = {
    watermark,
    state: employee_state,
    ssid,
    employee_Id,
    employee_name,
    employee_address: getComputedString({
      address: employee_address,
      address2: employee_address_2,
      state: employee_state,
      city: employee_city,
      zipCode: employeeZipCode,
    }),
    company_name,
    company_address: getComputedString({
      address: company_address,
      address2: company_address_2,
      state: company_state,
      city: company_city,
      zipCode: companyZipCode,
    }),
    company_image: `http://localhost:5000/logo.png`,
    company_phone,
    company_ein,
    hourly_rate,
    hours_worked,
    date: moment().format("MMMM D, YYYY"),
    net_pay_english: "",
    earnings_labels: [],
    income: [],
    deduction_labels: [],
    deductions_current: [],
    deduction_ytd: [],
    ytd_gross: 0,
    ytd_deductions: 0,
    ytd_netPay: 0,
    currentTotal: 0,
    currentDeductions: 0,
    net_pay: 0,
    company_ein,
    company_notes,
    bankNumber: "123421",
    routingNumber: "243222",
    manager,
    sign,
    bank_name,
    bank_street_address,
    bank_city,
    bank_state,
    bank_zip,
    startDate,
  };

  let ejsTempaltes = ["paystub-1.ejs"];
  let fileContent = ejsTempaltes.map((el) =>
    fs.readFileSync(path.join(__dirname, "../", "views", el), {
      encoding: "utf-8",
    })
  );

  let response = [];
  let index = 0;
  let pdfFiles = [];

  // loop start from here

  for await (const payDate of pay_dates) {
    let _income;
    if (employment_status === EMPLOYMENT_STATUS.Salary) {
      _income = formatNumber(
        (parseFloat(annual_salary) / 365) * parseInt(days)
      );
    } else if (employment_status === EMPLOYMENT_STATUS.Hourly) {
      _income = formatNumber(
        parseFloat(hourly_rate) * parseFloat(hours_worked[index])
      );
    } else {
      throw new Error("Invalid Employment Status");
    }

    params = {
      ...params,
      ...generateParams({
        additions: (additions || []).filter((el) =>
          areDatesEqual(convertDate(el.payDate), convertDate(payDate))
        ),
        deductions: (deductions || []).filter((el) =>
          areDatesEqual(convertDate(el.payDate), convertDate(payDate))
        ),
        otherBenefits: (otherBenefits || []).filter((el) =>
          areDatesEqual(convertDate(el.payDate), convertDate(payDate))
        ),
        income: _income,
        state: employee_state,
        maritial_status,
        employee_hiring_date: EmployeeHiredIn2021
          ? convertDate(hire_date)
          : null,
        pay_date: convertDate(payDate),
        days,
        check_number: check_numbers[index],
      }),
    };
    let start_date = startDate;
    if (index !== 0) {
      start_date = pay_dates[index - 1];
    }
    params.startDate = start_date;
    params.actualPayDate = moment(actual_pay_dates[index], "DD/MM/YYYY").format(
      "MM/DD/YYYY"
    );
    params.hourly_rate = null;
    params.hours_worked = null;
    params.net_pay_english =
      "To use Apple Pay, you need to register with Apple all of your web domains that will show an Apple Pay butto";

    if (employment_status === EMPLOYMENT_STATUS.Hourly) {
      params.hourly_rate = hourly_rate;
      params.hours_worked = hours_worked[index];
    }
    let template = await Promise.all(
      fileContent.map((el, idx) => {
        return new Promise(async (res, rej) => {
          let markupWithWatermark = await ejs.render(el, params, {
            async: true,
          });

          let watemarkImageFilePath = `paystub-${Date.now()}-${idx}.png`;

          await nodeHtmlToImage({
            output: `./public/${watemarkImageFilePath}`,
            html: markupWithWatermark,
            puppeteerArgs: {
              headless: true,
              args: ["--no-sandbox"],
            },
          });

          let markupWithoutWatermark = await ejs.render(
            el,
            { ...params, watermark: null },
            {
              async: true,
            }
          );

          let imageFilePath = `paystub-pdf-${Date.now()}-${idx}.png`;
          await nodeHtmlToImage({
            output: `./public/${imageFilePath}`,
            html: markupWithoutWatermark,
            puppeteerArgs: {
              headless: true,
              args: ["--no-sandbox"],
            },
          });

          let pdfFilename = `paystub-${Date.now()}-${idx}.pdf`;
          let pdfFilePath = `public/${pdfFilename}`;
          const doc = new PDFDocument();
          const stream = doc.pipe(fs.createWriteStream(pdfFilePath));

          doc.image(
            path.join(__dirname, "../", "public", imageFilePath),
            0,
            30,
            { width: 600, height: 770 }
          );
          doc.end();

          stream.on("finish", () => {
            res({
              image: watemarkImageFilePath,
              pdf: pdfFilename,
            });
          });
        });
      })
    );
    index++;
  }
  res.render("paystub-3", params);
});

module.exports = router;
