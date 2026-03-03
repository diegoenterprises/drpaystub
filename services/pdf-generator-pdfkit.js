const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const sharp = require("sharp");
const QRCode = require("qrcode");

// ─── Saurellius Logo (SVG → PNG buffer, cached at module load) ──────────────
var _logoBuffer = null;
(function loadLogo() {
  var svgCandidates = [
    path.resolve(__dirname, "../assets/saurellius-logo.svg"),
    path.resolve(__dirname, "../client/public/saurellius-logo.svg"),
    path.resolve(__dirname, "../client/src/assets/img/saurellius-logo.svg"),
  ];
  var svgPath = null;
  for (var i = 0; i < svgCandidates.length; i++) {
    if (fs.existsSync(svgCandidates[i])) { svgPath = svgCandidates[i]; break; }
  }
  if (!svgPath) { console.warn("[PDF] Saurellius logo SVG not found — using fallback"); return; }
  sharp(svgPath)
    .resize(120, 120, { fit: "contain", background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer()
    .then(function(buf) { _logoBuffer = buf; console.log("[PDF] Saurellius logo loaded ("+buf.length+" bytes)"); })
    .catch(function(err) { console.warn("[PDF] Logo conversion failed:", err.message); });
})();

// ─── Payroll Metadata Profiles ───────────────────────────────────────────────
const PAYROLL_PROFILES = [
  { producer: "ADP Workforce Now v12.4.1", creator: "ADP Payroll Engine", author: "ADP, LLC" },
  { producer: "Paychex Flex v8.2.0", creator: "Paychex Payroll Processing", author: "Paychex, Inc." },
  { producer: "Gusto Payroll v5.1.3", creator: "Gusto Pay Engine", author: "Gusto, Inc." },
  { producer: "QuickBooks Payroll v24.0", creator: "Intuit Payroll Services", author: "Intuit Inc." },
  { producer: "Workday HCM v2024.1", creator: "Workday Payroll", author: "Workday, Inc." },
];

function getPayrollProfile(companyName) {
  const hash = crypto.createHash("md5").update(companyName || "default").digest("hex");
  return PAYROLL_PROFILES[parseInt(hash.substring(0, 8), 16) % PAYROLL_PROFILES.length];
}

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " HUNDRED" + (n % 100 ? " " + convert(n % 100) : "");
    if (n < 1000000) return convert(Math.floor(n / 1000)) + " THOUSAND" + (n % 1000 ? " " + convert(n % 1000) : "");
    return convert(Math.floor(n / 1000000)) + " MILLION" + (n % 1000000 ? " " + convert(n % 1000000) : "");
  }
  const dollars = Math.floor(Math.abs(num));
  const cents = Math.round((Math.abs(num) - dollars) * 100);
  return convert(dollars) + " DOLLARS AND " + (cents < 10 ? "0" : "") + cents + "/100";
}

// ─── PDFKit Direct Paystub Renderer ──────────────────────────────────────────
// Renders paystubs directly using PDFKit's built-in Helvetica fonts.
// Zero system-font dependencies. Works on any OS including Azure Linux.
// Layout matches the reference earnings statement + check voucher design.

// ─── 6 Template Color Themes ─────────────────────────────────────────────────
// Matches the original EJS template CSS variables
var TEMPLATE_THEMES = {
  1: { TABLE_BG: [222,225,240], BORDER_CLR: [171,186,225], ENG_WORDS: [208,210,212], TOTAL_BG: [208,210,212] },       // Blue
  2: { TABLE_BG: [249,215,215], BORDER_CLR: [243,179,179], ENG_WORDS: [243,179,179], TOTAL_BG: [243,179,179] },       // Red/Pink
  3: { TABLE_BG: [241,217,235], BORDER_CLR: [231,193,221], ENG_WORDS: [231,193,221], TOTAL_BG: [231,193,221] },       // Purple/Mauve
  4: { TABLE_BG: [223,241,235], BORDER_CLR: [192,229,217], ENG_WORDS: [192,229,217], TOTAL_BG: [192,229,217] },       // Green
  5: { TABLE_BG: [245,228,177], BORDER_CLR: [239,217,151], ENG_WORDS: [239,217,151], TOTAL_BG: [239,217,151] },       // Gold
  6: { TABLE_BG: [179,245,239], BORDER_CLR: [136,221,213], ENG_WORDS: [136,221,213], TOTAL_BG: [136,221,213] },       // Teal
};

function drawPaystub(doc, params, template, qrBuffer) {
  var tpl = template || 1;
  var theme = TEMPLATE_THEMES[tpl] || TEMPLATE_THEMES[1];

  const PW = 612; // page width (letter)
  const L = 30;   // left margin
  const R = PW - 30; // right edge

  // Colors (RGB arrays for PDFKit) — theme-driven
  const TABLE_BG   = theme.TABLE_BG;
  const BORDER_CLR = theme.BORDER_CLR;
  const YELLOW     = [255, 255, 204]; // #ffffcc
  const GRAY_BG    = theme.ENG_WORDS;
  const BLUE_DARK  = [0, 82, 161];    // #0052a1
  const RED_CHECK  = [244, 131, 108]; // #f4836c
  const WHITE      = [255, 255, 255];
  const BLACK      = [0, 0, 0];
  const GRAY       = [102, 102, 102];
  const DARK_LINE  = [103, 100, 100]; // #676464

  // helper: draw rect with fill + stroke
  const box = (x, y, w, h, fill, strokeClr, lw) => {
    doc.save();
    doc.rect(x, y, w, h).fill(fill);
    if (strokeClr) doc.rect(x, y, w, h).lineWidth(lw || 0.5).strokeColor(strokeClr).stroke();
    doc.restore();
  };

  // ══════════════════════════════════════════════════════════════
  // SECTION 1: EARNINGS STATEMENT
  // ══════════════════════════════════════════════════════════════

  // Company name (italic bold, top-left)
  doc.font("Helvetica-BoldOblique").fontSize(15).fillColor(BLACK);
  doc.text(params.company_name || "Company", L, 24, { lineBreak: false });
  doc.font("Helvetica-Oblique").fontSize(9).fillColor(BLACK);
  doc.text(params.state || "", L, 42, { lineBreak: false });

  // "Earnings Statement" title (right of center)
  doc.font("Helvetica-Bold").fontSize(19).fillColor(BLACK);
  doc.text("Earnings Statement", 300, 24, { lineBreak: false });

  // Saurellius hexagon S logo
  if (_logoBuffer) {
    try {
      doc.image(_logoBuffer, 538, 14, { width: 38, height: 38 });
    } catch (e) { /* fallback below */ }
  }
  if (!_logoBuffer) {
    // Fallback: draw simplified hexagon S in purple-blue gradient colors
    var cx = 557, cy = 33, r = 16;
    doc.save();
    doc.moveTo(cx, cy - r).lineTo(cx + r * 0.866, cy - r * 0.5)
       .lineTo(cx + r * 0.866, cy + r * 0.5).lineTo(cx, cy + r)
       .lineTo(cx - r * 0.866, cy + r * 0.5).lineTo(cx - r * 0.866, cy - r * 0.5)
       .closePath().lineWidth(2.5).strokeColor([124, 92, 252]).stroke();
    doc.font("Helvetica-Bold").fontSize(16).fillColor([124, 92, 252]);
    doc.text("S", cx - 5.5, cy - 8, { lineBreak: false });
    doc.restore();
  }
  doc.fillOpacity(1);

  // Period info (right side)
  var py = 52;
  doc.font("Helvetica").fontSize(9.5);
  doc.fillColor(GRAY).text("Period Start:", 300, py, { lineBreak: false });
  doc.fillColor(BLACK).text(params.startDate || "", 410, py, { lineBreak: false });
  py += 15;
  doc.fillColor(GRAY).text("Period Ending:", 300, py, { lineBreak: false });
  doc.fillColor(BLACK).text(params.actualPayDate || "", 410, py, { lineBreak: false });
  py += 15;
  doc.fillColor(GRAY).text("Pay date:", 300, py, { lineBreak: false });
  doc.fillColor(BLACK).text(params.actualPayDate || params.date || "", 410, py, { lineBreak: false });

  // Employee info (left side, below company)
  var ey = 62;
  doc.font("Helvetica").fontSize(9).fillColor(BLACK);
  doc.text("SSN: " + (params.ssid || "XXX-XX-XXXX"), L, ey, { lineBreak: false });
  ey += 13;
  doc.text("Taxable Marital Status: " + (params.maritial_status || "Single Taxpayers"), L, ey, { lineBreak: false });
  ey += 13;
  doc.text("Exemptions/Allowances:", L, ey, { lineBreak: false });
  ey += 12;
  doc.text("Federal: 12.00", L + 10, ey, { lineBreak: false });
  ey += 11;
  doc.text("State: 4.00", L + 10, ey, { lineBreak: false });
  ey += 11;
  doc.text("Medicare: 1.45", L + 10, ey, { lineBreak: false });

  // Employee name + state (right-center)
  doc.font("Helvetica-Bold").fontSize(13).fillColor(BLACK);
  doc.text(params.employee_name || "", 300, 114, { lineBreak: false });
  doc.font("Helvetica").fontSize(10).fillColor(BLACK);
  doc.text(params.state || "", 300, 131, { lineBreak: false });

  // ═══════════ TABLES AREA ═══════════
  var y = 158;
  var TH = 19; // table header height
  var TR = 17; // table row height

  // Left table
  var LT = L;
  var LW = 340;
  // Right table
  var RX = LT + LW + 12;
  var RW = R - RX;

  // Earnings column x positions
  var c0 = LT + 5;   // Earnings label
  var c1 = LT + 100; // Rate
  var c2 = LT + 155; // Hours
  var c3 = LT + 210; // This period
  var c4 = LT + 280; // Year to date

  // ── Earnings Header ──
  box(LT, y, LW, TH, TABLE_BG, BORDER_CLR, 0.8);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(BLACK);
  doc.text("Earnings", c0, y + 5, { lineBreak: false });
  doc.text("Rate", c1, y + 5, { lineBreak: false });
  doc.text("Hours", c2, y + 5, { lineBreak: false });
  doc.text("This period", c3, y + 5, { lineBreak: false });
  doc.text("Year to date", c4, y + 5, { lineBreak: false });
  y += TH;

  // Earnings rows
  var earningsLabels = (params.earnings_labels && params.earnings_labels.length > 0)
    ? params.earnings_labels : ["Regular Earnings"];
  var incomeArr = Array.isArray(params.income) ? params.income : [params.income || params.currentTotal || "0"];

  earningsLabels.forEach(function(label, i) {
    box(LT, y, LW, TR, WHITE, BORDER_CLR, 0.3);
    doc.font("Helvetica").fontSize(8).fillColor(BLACK);
    doc.text(label, c0, y + 4, { lineBreak: false });
    if (params.hourly_rate) {
      doc.text(String(params.hourly_rate), c1, y + 4, { lineBreak: false });
      doc.text(String(params.hours_worked || ""), c2, y + 4, { lineBreak: false });
    }
    doc.text(fmt$(incomeArr[i] || incomeArr[0]), c3, y + 4, { lineBreak: false });
    doc.text(fmt$(params.ytd_gross || incomeArr[i] || incomeArr[0]), c4, y + 4, { lineBreak: false });
    y += TR;
  });

  // Gross Pay row (yellow highlight)
  box(LT, y, LW, TR, YELLOW, BORDER_CLR, 0.8);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(BLACK);
  doc.text("Gross Pay", c1, y + 4, { lineBreak: false });
  doc.text(fmt$(params.currentTotal), c3, y + 4, { lineBreak: false });
  doc.text(fmt$(params.ytd_gross), c4, y + 4, { lineBreak: false });
  y += TR;

  // Deductions Header
  box(LT, y, LW, TH, TABLE_BG, BORDER_CLR, 0.8);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(BLACK);
  doc.text("Deductions", c0, y + 5, { lineBreak: false });
  doc.text("Statutory", c1, y + 5, { lineBreak: false });
  y += TH;

  // Deduction rows
  var dedLabels = params.deduction_labels || [];
  var dedCurrent = params.deductions_current || [];
  var dedYtd = params.deduction_ytd || [];

  dedLabels.forEach(function(label, i) {
    box(LT, y, LW, TR, WHITE, BORDER_CLR, 0.3);
    doc.font("Helvetica").fontSize(8).fillColor(BLACK);
    doc.text(label, c1, y + 4, { lineBreak: false });
    doc.text("-" + fmt$(dedCurrent[i] || "0"), c3, y + 4, { lineBreak: false });
    doc.text("-" + fmt$(dedYtd[i] || "0"), c4, y + 4, { lineBreak: false });
    y += TR;
  });

  // Net Pay row (yellow highlight)
  box(LT, y, LW, TR + 2, YELLOW, BORDER_CLR, 0.8);
  doc.font("Helvetica-Bold").fontSize(9).fillColor(BLACK);
  doc.text("Net Pay", c0, y + 4, { lineBreak: false });
  doc.text(fmt$(params.net_pay), c3, y + 4, { lineBreak: false });
  doc.text(fmt$(params.ytd_netPay), c4, y + 4, { lineBreak: false });
  y += TR + 2;

  // ── Right Table: Other Benefits ──
  var rty = 158;
  box(RX, rty, RW, TH, TABLE_BG, BORDER_CLR, 0.8);
  doc.font("Helvetica-Bold").fontSize(7).fillColor(BLACK);
  doc.text("Other Benefits and Information", RX + 5, rty + 5, { lineBreak: false });
  doc.text("Amount", RX + RW - 42, rty + 5, { lineBreak: false });

  box(RX, rty + TH, RW, TH, WHITE, BORDER_CLR, 0.3);
  doc.font("Helvetica-Bold").fontSize(8).fillColor(BLACK);
  doc.text("Important Notes", RX + 5, rty + TH + 5, { lineBreak: false });

  // Notes area
  var notesH = TR * 5;
  box(RX, rty + TH * 2, RW, notesH, WHITE, BORDER_CLR, 0.3);
  if (params.company_notes) {
    doc.font("Helvetica").fontSize(7).fillColor(GRAY);
    doc.text(params.company_notes, RX + 5, rty + TH * 2 + 5, { width: RW - 10 });
  }

  // Copyright text (vertical, right edge)
  doc.save();
  doc.rotate(90, { origin: [R + 10, 210] });
  doc.font("Helvetica").fontSize(6).fillColor(GRAY);
  doc.text("\u00A9 2024, 2025, 2026, SAURELLIUS", R + 7, 210, { lineBreak: false });
  doc.restore();

  doc.save();
  doc.rotate(90, { origin: [R + 10, 340] });
  doc.font("Helvetica-Bold").fontSize(7).fillColor(BLACK);
  doc.text("\u25BC TEAR HERE", R + 7, 340, { lineBreak: false });
  doc.restore();

  // ══════════════════════════════════════════════════════════════
  // SECTION 2: CHECK VOUCHER
  // ══════════════════════════════════════════════════════════════

  // Dashed tear line
  y = Math.max(y + 16, 555);
  doc.save();
  doc.dash(5, { space: 3 });
  doc.moveTo(L, y).lineTo(R, y).lineWidth(0.7).strokeColor(GRAY).stroke();
  doc.undash();
  doc.restore();
  y += 6;

  // ── Holographic gradient fingerprint authentication strip (template-independent) ──
  var barH = 18;
  var barW = R - L;
  var sliceW = 1; // 1pt-wide vertical slices for smooth gradient

  // Holographic color stops: purple → blue → teal → green → gold → magenta → purple
  var holoStops = [
    [148, 103, 189], // purple
    [100, 130, 220], // blue
    [70, 180, 210],  // teal
    [80, 200, 160],  // sea green
    [180, 195, 100], // lime-gold
    [220, 180, 80],  // gold
    [210, 120, 150], // rose
    [170, 100, 200], // magenta
    [148, 103, 189], // back to purple
  ];

  // Draw holographic gradient slices
  for (var s = 0; s < barW; s += sliceW) {
    var t = s / barW;
    var segF = t * (holoStops.length - 1);
    var segI = Math.floor(segF);
    var segT = segF - segI;
    if (segI >= holoStops.length - 1) { segI = holoStops.length - 2; segT = 1; }
    var c0 = holoStops[segI], c1 = holoStops[segI + 1];
    var cr = Math.round(c0[0] + (c1[0] - c0[0]) * segT);
    var cg = Math.round(c0[1] + (c1[1] - c0[1]) * segT);
    var cb = Math.round(c0[2] + (c1[2] - c0[2]) * segT);
    doc.save();
    doc.rect(L + s, y, sliceW + 0.5, barH).fill([cr, cg, cb]);
    doc.restore();
  }

  // Vertical shimmer: lighter band at top, darker at bottom
  doc.save();
  doc.rect(L, y, barW, barH * 0.35).fillOpacity(0.18).fill([255, 255, 255]);
  doc.restore();
  doc.save();
  doc.rect(L, y + barH * 0.7, barW, barH * 0.3).fillOpacity(0.12).fill([0, 0, 0]);
  doc.restore();

  // Fingerprint ridges: concentric arcs with low opacity
  doc.save();
  doc.rect(L, y, barW, barH).clip();
  var fpCx = L + barW * 0.5;
  var fpCy = y + barH * 0.5;
  for (var r = 3; r < 60; r += 2.8) {
    doc.save();
    doc.lineWidth(0.4).strokeOpacity(0.09).strokeColor([255, 255, 255]);
    // Draw partial arcs (fingerprint whorl effect)
    var aStart = -0.8 + (r * 0.05);
    var aEnd = Math.PI + 0.8 - (r * 0.03);
    var pts = 20;
    doc.moveTo(fpCx + r * Math.cos(aStart), fpCy + r * 0.45 * Math.sin(aStart));
    for (var p = 1; p <= pts; p++) {
      var a = aStart + (aEnd - aStart) * (p / pts);
      doc.lineTo(fpCx + r * Math.cos(a), fpCy + r * 0.45 * Math.sin(a));
    }
    doc.stroke();
    doc.restore();
  }
  // Second fingerprint cluster offset right
  var fp2Cx = L + barW * 0.78;
  for (var r2 = 2; r2 < 40; r2 += 3.2) {
    doc.save();
    doc.lineWidth(0.35).strokeOpacity(0.07).strokeColor([255, 255, 255]);
    var a2S = -0.5 + (r2 * 0.04);
    var a2E = Math.PI + 0.5 - (r2 * 0.02);
    doc.moveTo(fp2Cx + r2 * Math.cos(a2S), fpCy + r2 * 0.4 * Math.sin(a2S));
    for (var p2 = 1; p2 <= 16; p2++) {
      var a2 = a2S + (a2E - a2S) * (p2 / 16);
      doc.lineTo(fp2Cx + r2 * Math.cos(a2), fpCy + r2 * 0.4 * Math.sin(a2));
    }
    doc.stroke();
    doc.restore();
  }
  doc.restore(); // unclip

  // Micro-dot texture overlay
  doc.save();
  doc.rect(L, y, barW, barH).clip();
  for (var dx = 0; dx < barW; dx += 6) {
    for (var dy2 = 0; dy2 < barH; dy2 += 4) {
      doc.circle(L + dx + ((dy2 % 8 === 0) ? 1.5 : 0), y + dy2, 0.3).fillOpacity(0.06).fill([255, 255, 255]);
    }
  }
  doc.restore();

  // Text overlay
  doc.fillOpacity(1);
  doc.font("Helvetica-Bold").fontSize(5).fillColor([255, 255, 255]);
  doc.text(
    "VERIFY DOCUMENT AUTHENTICITY: COLOR AREA MUST CHANGE IN TONE GRADUALLY AND EVENLY FROM DARK AT TOP TO LIGHTER AT BOTTOM",
    L + 8, y + 6, { width: barW - 16, align: "center" }
  );
  y += barH + 4;

  // Check number (red, right-aligned)
  var checkNumber = params.check_number || ("D" + Math.floor(100000 + Math.random() * 900000));
  doc.font("Helvetica-Bold").fontSize(22).fillColor(RED_CHECK);
  doc.text(String(checkNumber), R - 160, y, { width: 150, align: "right", lineBreak: false });

  // Employee name + state (left)
  y += 8;
  doc.font("Helvetica").fontSize(10).fillColor(BLACK);
  doc.text(params.employee_name || "", L + 15, y, { lineBreak: false });
  doc.font("Helvetica").fontSize(9).fillColor(BLACK);
  doc.text(params.state || "", L + 15, y + 14, { lineBreak: false });

  // Check info (right side)
  var ciL = 300;
  var ciV = 410;
  doc.font("Helvetica").fontSize(9).fillColor(GRAY);
  doc.text("Payroll check number:", ciL, y, { lineBreak: false });
  doc.fillColor(BLACK).text(String(checkNumber), ciV, y, { lineBreak: false });
  doc.fillColor(GRAY).text("Pay date:", ciL, y + 14, { lineBreak: false });
  doc.fillColor(BLACK).text(params.actualPayDate || params.date || "", ciV, y + 14, { lineBreak: false });
  doc.fillColor(GRAY).text("Social Security No", ciL, y + 28, { lineBreak: false });
  doc.fillColor(BLACK).text(params.ssid || "XXX-XX-XXXX", ciV, y + 28, { lineBreak: false });

  // Horizontal rule
  y += 48;
  doc.moveTo(L, y).lineTo(R, y).lineWidth(1.2).strokeColor(DARK_LINE).stroke();
  y += 5;

  // "Pay to the order of:"
  doc.font("Helvetica").fontSize(8).fillColor(GRAY);
  doc.text("Pay to the", L + 5, y + 2, { lineBreak: false });
  doc.text("order of:", L + 5, y + 12, { lineBreak: false });
  doc.font("Helvetica-Bold").fontSize(14).fillColor(BLACK);
  doc.text((params.employee_name || "").toUpperCase(), L + 62, y + 6, { lineBreak: false });

  // Amount in words + dollar amount box
  y += 30;
  doc.font("Helvetica").fontSize(8).fillColor(GRAY);
  doc.text("This amount:", L + 5, y + 4, { lineBreak: false });

  var netPay = parseFloat(params.net_pay) || 0;
  var amountWords = numberToWords(netPay);

  // Words box (gray background)
  box(L + 62, y - 2, 310, 22, GRAY_BG, DARK_LINE, 0.7);
  doc.font("Helvetica-Bold").fontSize(6.5).fillColor(BLACK);
  doc.text(amountWords, L + 68, y + 4, { width: 300, lineBreak: false });

  // Dollar amount box
  box(R - 108, y - 2, 98, 22, WHITE, DARK_LINE, 1.2);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(BLACK);
  doc.text(fmt$(params.net_pay), R - 106, y + 3, { width: 94, align: "center" });

  // Disclaimers
  y += 32;
  doc.font("Helvetica-Bold").fontSize(8).fillColor(BLACK);
  doc.text("THIS IS NOT A CHECK", L + 62, y, { lineBreak: false });
  doc.text("NON-NEGOTIABLE", L + 62, y + 11, { lineBreak: false });
  doc.text("VOID AFTER 180 DAYS", L + 62, y + 22, { lineBreak: false });

  // Authorized signature line
  doc.moveTo(330, y + 14).lineTo(R - 8, y + 14).lineWidth(0.7).strokeColor(DARK_LINE).stroke();
  doc.font("Helvetica").fontSize(7).fillColor(GRAY);
  doc.text("AUTHORIZED SIGNATURE ()", 348, y + 18, { lineBreak: false });
  doc.text("VOID AFTER 90 DAYS", 348, y + 28, { lineBreak: false });

  // Signature image (if provided — supports base64 data URL from signature pad or file path)
  if (params.sign) {
    try {
      var sigData = params.sign;
      if (typeof sigData === "string" && sigData.startsWith("data:image")) {
        var base64 = sigData.split(",")[1];
        if (base64) {
          var sigBuffer = Buffer.from(base64, "base64");
          doc.image(sigBuffer, 340, y - 6, { width: 120, height: 24 });
        }
      } else if (typeof sigData === "string" && fs.existsSync(sigData)) {
        doc.image(sigData, 340, y - 6, { width: 120, height: 24 });
      }
    } catch (e) { /* signature not available, skip */ }
  }

  // QR code (if company website provided)
  if (qrBuffer && params.company_website) {
    var qrSize = 52;
    var qrX = R - qrSize - 2;
    var qrY = y - 8;
    doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
    doc.font("Helvetica").fontSize(4.5).fillColor(GRAY);
    doc.text(params.company_website.replace(/^https?:\/\//, "").replace(/\/$/, ""), qrX - 30, qrY + qrSize + 2, { width: qrSize + 60, align: "center", lineBreak: false });
  }

  // Bottom security bar
  y += 46;
  var barW = R - L;
  // Red section
  box(L, y, barW * 0.45, 14, [204, 51, 51], null);
  doc.font("Helvetica-Bold").fontSize(5).fillColor(WHITE);
  doc.text("THE ORIGINAL DOCUMENT HAS SAURELLIUS WATERMARK", L + 8, y + 4, { lineBreak: false });
  // Blue section
  box(L + barW * 0.45, y, barW * 0.55, 14, [196, 203, 229], null);
  doc.font("Helvetica-Bold").fontSize(5).fillColor([51, 51, 51]);
  doc.text("HOLD AT AN ANGLE TO VIEW WHEN CHECKING THE ENDORSEMENT", L + barW * 0.45 + 8, y + 4, { lineBreak: false });
}

// ─── Create Preview PDF ──────────────────────────────────────────────────────
// Generates a preview PDF using PDFKit with built-in Helvetica fonts.
// This replaces the old SVG→sharp→PNG pipeline.

async function createHighResImage(outputPath, params, template) {
  return new Promise(async function(resolve, reject) {
    // If params is not an object (legacy HTML string), create minimal PDF
    if (typeof params !== "object" || params === null || Buffer.isBuffer(params)) {
      var simpleDoc = new PDFDocument({ size: "letter", margin: 50 });
      var simpleStream = simpleDoc.pipe(fs.createWriteStream(outputPath));
      simpleDoc.font("Helvetica-Bold").fontSize(24).text("Pay Statement", { align: "center" });
      simpleDoc.end();
      simpleStream.on("finish", resolve);
      simpleStream.on("error", reject);
      return;
    }

    // Generate QR code buffer if company website is provided
    var qrBuffer = null;
    if (params.company_website) {
      try {
        var url = params.company_website;
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
        qrBuffer = await QRCode.toBuffer(url, { type: "png", width: 200, margin: 1, color: { dark: "#000000", light: "#ffffff" } });
      } catch (e) { /* skip QR if generation fails */ }
    }

    var doc = new PDFDocument({
      size: "letter",
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      compress: true,
      autoFirstPage: true,
    });

    var stream = doc.pipe(fs.createWriteStream(outputPath));
    drawPaystub(doc, params, template, qrBuffer);

    // Add PREVIEW watermark overlay (only on preview, not final download)
    var pages = doc.bufferedPageRange();
    for (var pi = pages.start; pi < pages.start + pages.count; pi++) {
      doc.switchToPage(pi);
      doc.save();
      doc.translate(306, 396);
      doc.rotate(-45);
      doc.font("Helvetica-Bold").fontSize(72).fillOpacity(0.12).fillColor([120, 120, 120]);
      doc.text("PREVIEW", -180, -30, { width: 360, align: "center" });
      doc.restore();
      doc.save();
      doc.translate(306, 396);
      doc.rotate(-45);
      doc.font("Helvetica-Bold").fontSize(72).fillOpacity(0.08).fillColor([120, 120, 120]);
      doc.text("PREVIEW", -180, 60, { width: 360, align: "center" });
      doc.restore();
    }

    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });
}

// ─── Snappt-Resistant Secure PDF Generator ───────────────────────────────────
// Generates PDFs with all anti-detection layers:
//   1. Direct PDFKit rendering (built-in Helvetica, no image dependency)
//   2. Authentic payroll software metadata
//   3. Full invisible text layer mirroring ALL visible content
//   4. PDF permissions matching real payroll software
//   5. Owner password, PDF 1.7, content stream compression
//   6. Dual integrity hashes for document verification

async function generateSecurePDF(imagePath, outputPath, params, options) {
  // imagePath kept for backward API compatibility but ignored — we draw directly
  // Generate QR code buffer if company website is provided
  var qrBuffer = null;
  if (params.company_website) {
    try {
      var qrUrl = params.company_website;
      if (!/^https?:\/\//i.test(qrUrl)) qrUrl = "https://" + qrUrl;
      qrBuffer = await QRCode.toBuffer(qrUrl, { type: "png", width: 200, margin: 1, color: { dark: "#000000", light: "#ffffff" } });
    } catch (e) { /* skip QR if generation fails */ }
  }

  return new Promise(function(resolve, reject) {
    var profile = getPayrollProfile(params.company_name);
    var generationDate = params._generationTimestamp
      ? new Date(params._generationTimestamp)
      : new Date();
    var docHash = generateDocumentHash(params);

    var doc = new PDFDocument({
      size: "letter",
      margins: { top: 0, bottom: 0, left: 0, right: 0 },
      info: {
        Title: "Pay Statement - " + (params.employee_name || "Employee"),
        Author: profile.author,
        Subject: "Payroll Statement " + (params.date || ""),
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

    var stream = doc.pipe(fs.createWriteStream(outputPath));

    // ── Layer 1: Draw the paystub directly with PDFKit ──
    var tplNum = (options && options.template) || params._template || 1;
    drawPaystub(doc, params, tplNum, qrBuffer);

    // ── Layer 2: Full invisible text layer ──
    // Real payroll PDFs have ALL text as selectable/searchable content.
    // Font size 0.1pt, white at 0.1% opacity = invisible to eye, readable by extractors.
    var T = function(text, x, ty, opts) {
      if (!text && text !== 0) return;
      doc.fontSize(0.1).fillColor("white").fillOpacity(0.001);
      doc.text(String(text), x, ty, Object.assign({ continued: false }, opts || {}));
    };

    // Company header
    T("PAY STATEMENT", 250, 20);
    T(params.company_name, 30, 28);
    T(params.company_address, 30, 36);
    T(params.company_phone ? "Tel: " + params.company_phone : "", 30, 44);
    T(params.company_ein ? "EIN: " + params.company_ein : "", 30, 52);
    T("Earnings Statement", 300, 24);
    T(params.actualPayDate || params.date, 410, 52);
    T(params.startDate ? "Period: " + params.startDate : "", 410, 67);

    // Employee info
    T("EMPLOYEE", 30, 62);
    T(params.employee_name, 30, 72);
    T(params.employee_address, 30, 80);
    T("SSN: " + (params.ssid || ""), 30, 88);
    T(params.employee_Id ? "Employee ID: " + params.employee_Id : "", 30, 96);
    T("Taxable Marital Status: " + (params.maritial_status || ""), 30, 104);

    // Earnings table
    var ty = 158;
    T("Earnings", 30, ty);
    T("Rate", 100, ty);
    T("Hours", 155, ty);
    T("This period", 210, ty);
    T("Year to date", 280, ty);
    ty += 19;

    var eLabels = params.earnings_labels || ["Regular"];
    var eIncome = Array.isArray(params.income) ? params.income : [params.income || "0"];
    eLabels.forEach(function(label, i) {
      T(label, 30, ty);
      if (params.hourly_rate) {
        T(fmt$(params.hourly_rate) + " x " + (params.hours_worked || ""), 100, ty);
      }
      T(fmt$(eIncome[i] || eIncome[0]), 210, ty);
      T(fmt$(params.ytd_gross || eIncome[i] || eIncome[0]), 280, ty);
      ty += 17;
    });
    T("Gross Pay", 30, ty);
    T(fmt$(params.currentTotal), 210, ty);
    T(fmt$(params.ytd_gross), 280, ty);
    ty += 20;

    // Deductions
    if (params.deduction_labels && params.deduction_labels.length > 0) {
      T("Deductions", 30, ty);
      T("Statutory", 100, ty);
      ty += 19;
      params.deduction_labels.forEach(function(label, i) {
        T(label, 100, ty);
        var curDed = params.deductions_current ? params.deductions_current[i] : "0";
        var ytdDed = params.deduction_ytd ? params.deduction_ytd[i] : "0";
        T("-" + fmt$(curDed), 210, ty);
        T("-" + fmt$(ytdDed), 280, ty);
        ty += 17;
      });
    }

    // Net pay
    T("Net Pay", 30, ty);
    T(fmt$(params.net_pay), 210, ty);
    T(params.ytd_netPay ? fmt$(params.ytd_netPay) : "", 280, ty);
    ty += 20;

    // Check voucher text
    T("VERIFY DOCUMENT AUTHENTICITY", 200, ty + 20);
    T(params.check_number || "", 500, ty + 30);
    T(params.employee_name, 45, ty + 50);
    T(params.state || "", 45, ty + 60);
    T("Payroll check number: " + (params.check_number || ""), 300, ty + 50);
    T("Pay date: " + (params.actualPayDate || params.date || ""), 300, ty + 60);
    T("Social Security No " + (params.ssid || ""), 300, ty + 70);
    T("Pay to the order of: " + (params.employee_name || "").toUpperCase(), 30, ty + 90);
    var netPayVal = parseFloat(params.net_pay) || 0;
    T(numberToWords(netPayVal), 92, ty + 110);
    T(fmt$(params.net_pay), 500, ty + 110);
    T("THIS IS NOT A CHECK", 92, ty + 130);
    T("NON-NEGOTIABLE", 92, ty + 140);
    T("VOID AFTER 180 DAYS", 92, ty + 150);
    T("AUTHORIZED SIGNATURE", 348, ty + 140);

    // Notes & bank info
    if (params.company_notes) T(params.company_notes, 30, ty + 160);
    if (params.manager) T("Authorized: " + params.manager, 30, ty + 170);
    if (params.bank_name) {
      T("DIRECT DEPOSIT INFORMATION", 30, ty + 180);
      T(params.bank_name, 30, ty + 190);
    }
    T("THE ORIGINAL DOCUMENT HAS SAURELLIUS WATERMARK", 30, ty + 200);

    // ── Layer 3: Micro-hash footer ──
    doc.fontSize(1).fillColor("white").fillOpacity(0.01);
    doc.text(
      "DOCID:" + docHash + " VER:" + profile.producer + " TS:" + generationDate.toISOString(),
      10, 787, { width: 592, align: "center" }
    );

    // ── Layer 4: Secondary integrity hash ──
    var checkHash = crypto.createHash("md5")
      .update((params.company_name || "") + "|" + (params.employee_name || "") + "|" + (params.net_pay || "") + "|" + (params.date || ""))
      .digest("hex").substring(0, 12).toUpperCase();
    doc.fontSize(0.5).fillColor("white").fillOpacity(0.005);
    doc.text(
      "CHK:" + checkHash + " PRF:" + profile.producer.replace(/\s/g, "_"),
      412, 784, { width: 190, align: "right" }
    );

    doc.end();

    stream.on("finish", function() {
      resolve({ path: outputPath, hash: docHash, profile: profile.producer });
    });
    stream.on("error", function(err) {
      reject(err);
    });
  });
}

// Legacy compatibility stubs
function injectSecurityCSS(html) { return html; }
function fixFontReferences(html) { return html; }

module.exports = {
  createHighResImage,
  generateSecurePDF,
  getPayrollProfile,
  generateDocumentHash,
  injectSecurityCSS,
  fixFontReferences,
  PAYROLL_PROFILES,
};
