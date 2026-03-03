const fs = require("fs");
const path = require("path");

// ─── Azure Communication Services Email ──────────────────────────────────────
const ACS_CONNECTION_STRING = process.env.AZURE_EMAIL_CONNECTION_STRING || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "DoNotReply@drpaystub.net";
const APP_URL = process.env.FRONTEND_URL || process.env.URL || "https://drpaystub.net";

let emailClient = null;
let configured = false;

(async function initEmail() {
  if (!ACS_CONNECTION_STRING) {
    console.warn("[Email] AZURE_EMAIL_CONNECTION_STRING not set — emails will be logged only");
    return;
  }
  try {
    const { EmailClient } = require("@azure/communication-email");
    emailClient = new EmailClient(ACS_CONNECTION_STRING);
    configured = true;
    console.log("[Email] Azure Communication Services Email configured");
  } catch (err) {
    console.warn("[Email] @azure/communication-email not available:", err.message);
  }
})();

// ─── Branded HTML Email Template (Saurellius — EusoTrip design language) ─────
// Dark slate canvas, frosted glass card, gradient accent bar, Jony Ive precision.
function brandedEmail(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${title} - Saurellius</title>
</head>
<body style="margin:0;padding:0;background-color:#0B1120;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B1120;min-height:100vh">
<tr><td align="center" style="padding:40px 16px 20px">

<!-- Outer container -->
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px">

<!-- Logo + brand -->
<tr><td align="center" style="padding-bottom:32px">
  <table role="presentation" cellpadding="0" cellspacing="0">
  <tr>
    <td style="width:44px;height:44px;text-align:center;vertical-align:middle">
      <img src="${APP_URL}/logo192.png" alt="S" width="44" height="44" style="display:block;border:0;border-radius:12px" />
    </td>
    <td style="padding-left:12px">
      <span style="font-size:20px;font-weight:700;color:#FFFFFF;letter-spacing:0.5px">Saurellius</span>
    </td>
  </tr>
  </table>
</td></tr>

<!-- Glass card -->
<tr><td style="background:linear-gradient(145deg,rgba(30,41,59,0.80),rgba(15,23,42,0.95));border:1px solid rgba(255,255,255,0.06);border-radius:20px;overflow:hidden">

  <!-- Gradient accent bar -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="height:3px;background:linear-gradient(90deg,#7c5cfc,#a78bfa)"></td></tr>
  </table>

  <!-- Title -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="padding:36px 36px 0">
    <h1 style="margin:0;font-size:22px;font-weight:700;color:#FFFFFF;letter-spacing:-0.3px;line-height:1.3">${title}</h1>
  </td></tr>
  </table>

  <!-- Body -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
  <tr><td style="padding:20px 36px 36px;color:#94A3B8;font-size:15px;line-height:1.7">
    ${bodyHtml}
  </td></tr>
  </table>

</td></tr>

<!-- Footer -->
<tr><td style="padding:28px 0 0;text-align:center">
  <p style="margin:0 0 4px;font-size:12px;color:#475569;letter-spacing:0.5px">
    <span style="background:linear-gradient(90deg,#7c5cfc,#a78bfa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;font-weight:600">Saurellius</span>
  </p>
  <p style="margin:0 0 4px;font-size:11px;color:#334155">Professional Payroll Document Services</p>
  <p style="margin:0;font-size:11px;color:#1E293B">
    <a href="${APP_URL}/privacy-policy" style="color:#475569;text-decoration:none">Privacy</a>
    &nbsp;&middot;&nbsp;
    <a href="${APP_URL}/terms-and-conditions" style="color:#475569;text-decoration:none">Terms</a>
    &nbsp;&middot;&nbsp;
    <a href="${APP_URL}" style="color:#475569;text-decoration:none">drpaystub.net</a>
  </p>
</td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Branded CTA button — gradient */
function brandedButton(href, label, color) {
  const bg = color || "linear-gradient(135deg,#7c5cfc,#a78bfa)";
  const isSolid = !bg.includes("gradient");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px">
  <tr><td align="center">
    <a href="${href}" style="display:inline-block;padding:14px 36px;background:${bg};${isSolid ? "background-color:" + bg + ";" : ""}color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;border-radius:12px;letter-spacing:0.2px">${label}</a>
  </td></tr>
  </table>`;
}

/** Info row with icon for delivery emails */
function infoRow(icon, text) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:6px 0">
  <tr>
    <td style="width:32px;height:32px;background:rgba(124,92,252,0.12);border-radius:8px;text-align:center;vertical-align:middle;font-size:14px">${icon}</td>
    <td style="padding-left:12px;color:#CBD5E1;font-size:14px;line-height:1.5">${text}</td>
  </tr>
  </table>`;
}

/** Divider line */
function divider() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0">
  <tr><td style="height:1px;background:rgba(255,255,255,0.06)"></td></tr>
  </table>`;
}

// ─── Core Send Function (Azure Email) ────────────────────────────────────────
async function azureSend(options) {
  if (!configured || !emailClient) {
    console.log("[Email] NOT configured — would send:", { to: options.to, subject: options.subject });
    console.log("[Email] configured:", configured, "emailClient:", !!emailClient);
    return false;
  }
  try {
    console.log("[Email] Sending to:", options.to, "from:", FROM_EMAIL, "subject:", options.subject);
    const message = {
      senderAddress: FROM_EMAIL,
      content: {
        subject: options.subject,
        html: options.html || "",
        plainText: options.text || "",
      },
      recipients: {
        to: [{ address: options.to }],
      },
    };
    if (options.attachments && options.attachments.length > 0) {
      message.attachments = options.attachments;
      console.log("[Email] Attachments:", options.attachments.length, "files");
    }
    const poller = await emailClient.beginSend(message);
    console.log("[Email] Poller started, waiting for completion...");
    const result = await poller.pollUntilDone();
    console.log("[Email] Result:", JSON.stringify({ status: result.status, id: result.id, error: result.error }));
    if (result.status !== "Succeeded") {
      console.error("[Email] Send did not succeed. Status:", result.status, "Error:", JSON.stringify(result.error));
    }
    return result.status === "Succeeded";
  } catch (error) {
    console.error("[Email] Failed:", error.message);
    console.error("[Email] Error details:", JSON.stringify({ code: error.code, statusCode: error.statusCode, details: error.details }));
    return false;
  }
}

// ─── Paystub Delivery Email (with PDF attachments) ──────────────────────────
const sendEmail = async (to, zipSrc, employee_name) => {
  try {
    const attachments = [];
    if (zipSrc) {
      const zipPath = path.resolve(zipSrc);
      if (fs.existsSync(zipPath)) {
        const content = fs.readFileSync(zipPath);
        const ext = path.extname(zipPath).toLowerCase();
        attachments.push({
          name: path.basename(zipPath),
          contentType: ext === ".pdf" ? "application/pdf" : "application/zip",
          contentInBase64: content.toString("base64"),
        });
      }
    }

    const html = brandedEmail("Your Pay Stub is Ready", `
      <p style="margin:0 0 16px;color:#CBD5E1">Hello <strong style="color:#E2E8F0">${employee_name || "there"}</strong>,</p>
      <p style="margin:0 0 16px;color:#CBD5E1">Thank you for choosing Saurellius. Your pay stub has been successfully generated and is attached to this email.</p>
      ${divider()}
      ${infoRow("PDF", "Your pay stub PDF is attached below")}
      ${infoRow("&bull;", "Document includes embedded security layers")}
      ${infoRow("&bull;", "Ready for immediate use")}
      ${divider()}
      <p style="margin:0 0 12px;color:#94A3B8;font-size:14px">You can also access your documents anytime from your account dashboard.</p>
      ${brandedButton(APP_URL, "Go to Dashboard")}
      <p style="margin:16px 0 0;font-size:12px;color:#475569">If you have any questions, visit <a href="${APP_URL}" style="color:#a78bfa;text-decoration:none">drpaystub.net</a>.</p>
    `);

    await azureSend({
      to,
      subject: "Your Pay Stub is Ready - Saurellius",
      html,
      text: `Hello ${employee_name || "there"}, your pay stub is ready. Please find it attached to this email. Thank you for using Saurellius.`,
      attachments,
    });
    console.log("[Email] Paystub sent to:", to);
  } catch (e) {
    console.error("[Email] sendEmail error:", e.message);
  }
};

// ─── Verification Email ──────────────────────────────────────────────────────
const sendVerificationEmail = async (to, token) => {
  const url = process.env.URL || APP_URL;
  const verifyUrl = `${url}/api/auth/verify-email?token=${token}`;

  const html = brandedEmail("Verify Your Email", `
    <p style="margin:0 0 12px;color:#CBD5E1">Welcome to Saurellius!</p>
    <p style="margin:0 0 12px;color:#CBD5E1">Please verify your email address to activate your account.</p>
    ${brandedButton(verifyUrl, "Verify Email Address")}
    <p style="margin:12px 0 0;font-size:12px;color:#475569">This link expires in 24 hours. If you didn't create this account, ignore this email.</p>
  `);

  await azureSend({
    to,
    subject: "Verify Your Saurellius Account",
    html,
    text: "Verify your email by visiting: " + verifyUrl,
  });
};

// ─── Password Reset Email ────────────────────────────────────────────────────
const sendResetPasswordEmail = async (to, token) => {
  const url = process.env.FRONTEND_URL || APP_URL;
  const resetUrl = `${url}/reset-password/${to}/${token}`;

  const html = brandedEmail("Reset Your Password", `
    <p style="margin:0 0 12px;color:#CBD5E1">A password reset was requested for your Saurellius account.</p>
    ${brandedButton(resetUrl, "Reset Password")}
    <p style="margin:12px 0 0;font-size:12px;color:#475569">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
  `);

  await azureSend({
    to,
    subject: "Reset Your Saurellius Password",
    html,
    text: "Reset your password: " + resetUrl,
  });
};

// ─── OTP Email ───────────────────────────────────────────────────────────────
const sendOTP = async (to, otp) => {
  const html = brandedEmail("Your Verification Code", `
    <p style="margin:0 0 12px;color:#CBD5E1">Your verification code is:</p>
    <p style="margin:0 0 12px;font-size:28px;font-weight:700;color:#FFFFFF;letter-spacing:4px;text-align:center">${otp}</p>
    <p style="margin:12px 0 0;font-size:12px;color:#475569">This code expires in 10 minutes.</p>
  `);

  await azureSend({
    to,
    subject: "Your Saurellius Verification Code: " + otp,
    html,
    text: "Your verification code is: " + otp,
  });
};

// ─── Change Password Notification ────────────────────────────────────────────
const changePasswordEmail = async (to, password) => {
  const html = brandedEmail("Password Changed", `
    <p style="margin:0 0 12px;color:#CBD5E1">Your password has been changed by an admin.</p>
    <p style="margin:0 0 12px;color:#CBD5E1">Your new password is: <strong style="color:#FFFFFF">${password}</strong></p>
    <p style="margin:12px 0 0;font-size:12px;color:#475569">Please change this password after logging in.</p>
  `);

  await azureSend({
    to,
    subject: "Saurellius - Password Changed",
    html,
    text: "Your new password is: " + password,
  });
};

// ─── Send individual PDF attachments (called from getZip route) ──────────────
const sendPaystubPDFs = async (to, employee_name, pdfPaths, passwordDetails) => {
  try {
    console.log("[Email] sendPaystubPDFs called — to:", to, "name:", employee_name, "paths:", pdfPaths);
    const attachments = [];
    for (const pdfPath of pdfPaths) {
      const resolved = path.resolve(pdfPath);
      console.log("[Email] Checking PDF:", resolved, "exists:", fs.existsSync(resolved));
      if (fs.existsSync(resolved)) {
        const content = fs.readFileSync(resolved);
        attachments.push({
          name: path.basename(resolved),
          contentType: "application/pdf",
          contentInBase64: content.toString("base64"),
        });
      }
    }

    if (attachments.length === 0) {
      console.warn("[Email] No PDF files found to attach");
      return;
    }

    const plural = attachments.length > 1;
    const pwdRows = (passwordDetails || []).map((pd, i) =>
      `<tr>
        <td style="padding:8px 12px;border-bottom:1px solid #1E293B;color:#CBD5E1;font-size:13px">${pd.payPeriodStart || "—"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1E293B;color:#CBD5E1;font-size:13px">${pd.actualPayDate || "—"}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1E293B;font-family:monospace;font-size:13px;color:#a78bfa;font-weight:600;letter-spacing:0.5px">${pd.password}</td>
      </tr>`
    ).join("");

    const passwordSection = passwordDetails && passwordDetails.length > 0 ? `
      ${divider()}
      <p style="margin:0 0 8px;color:#E2E8F0;font-weight:600;font-size:15px">PDF Password Protection</p>
      <p style="margin:0 0 12px;color:#94A3B8;font-size:13px">Each PDF is password-protected for your security. Use the passwords below to open your document${plural ? "s" : ""}.</p>
      <table style="width:100%;border-collapse:collapse;margin-bottom:12px;border-radius:8px;overflow:hidden;background:rgba(15,23,42,0.5)">
        <thead>
          <tr style="background:rgba(30,41,59,0.7)">
            <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#64748B;font-weight:600">Period Start</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#64748B;font-weight:600">Pay Date</th>
            <th style="padding:8px 12px;text-align:left;font-size:11px;text-transform:uppercase;letter-spacing:0.05em;color:#64748B;font-weight:600">Password</th>
          </tr>
        </thead>
        <tbody>${pwdRows}</tbody>
      </table>
      <p style="margin:0 0 4px;color:#64748B;font-size:11px">Password formula: <span style="color:#94A3B8">LAST NAME (uppercase) + Last 4 of SSN + Pay Period Start Date (MMDDYYYY)</span></p>
    ` : "";

    const html = brandedEmail(`Your Pay Stub${plural ? "s Are" : " is"} Ready`, `
      <p style="margin:0 0 16px;color:#CBD5E1">Hello <strong style="color:#E2E8F0">${employee_name || "there"}</strong>,</p>
      <p style="margin:0 0 16px;color:#CBD5E1">Thank you for your purchase! Your payroll document${plural ? "s have" : " has"} been successfully generated and ${plural ? "are" : "is"} ready for use.</p>
      ${divider()}
      ${infoRow("PDF", `<strong style="color:#E2E8F0">${attachments.length}</strong> PDF${plural ? "s" : ""} attached to this email`)}
      ${infoRow("&bull;", "Documents are password-protected for security")}
      ${infoRow("&bull;", "Verified and ready for immediate use")}
      ${infoRow("&bull;", "Delivered to <strong style='color:#E2E8F0'>" + to + "</strong>")}
      ${passwordSection}
      ${divider()}
      <p style="margin:0 0 12px;color:#94A3B8;font-size:14px">Your documents are also available for download from your account. You can also view your passwords anytime in <strong style="color:#E2E8F0">My Paystubs</strong> on your dashboard.</p>
      ${brandedButton(APP_URL, "Go to Dashboard")}
      <p style="margin:16px 0 0;font-size:12px;color:#475569">Questions? Visit <a href="${APP_URL}" style="color:#a78bfa;text-decoration:none">drpaystub.net</a> &mdash; we're here to help.</p>
    `);

    const result = await azureSend({
      to,
      subject: `Your Pay Stub${plural ? "s" : ""} from Saurellius`,
      html,
      text: `Hello ${employee_name || "there"}, thank you for your purchase! Your ${attachments.length} pay stub${plural ? "s are" : " is"} attached to this email. Each PDF is password-protected. Password formula: LAST NAME (uppercase) + Last 4 of SSN + Pay Period Start Date (MMDDYYYY). Thank you for using Saurellius.`,
      attachments,
    });
    console.log(`[Email] sendPaystubPDFs result: ${result}, ${attachments.length} PDF(s) to: ${to}`);
  } catch (e) {
    console.error("[Email] sendPaystubPDFs error:", e.message, e.stack);
  }
};

module.exports = {
  sendEmail,
  sendOTP,
  sendVerificationEmail,
  sendResetPasswordEmail,
  changePasswordEmail,
  sendPaystubPDFs,
};
