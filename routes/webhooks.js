const express = require('express');
const router = express.Router();

const fs = require('fs');

// ─── Azure Communication Services Email ─────────────────────────────────────
const ACS_CONNECTION_STRING = process.env.AZURE_EMAIL_CONNECTION_STRING || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "DoNotReply@drpaystub.net";
const APP_URL = process.env.FRONTEND_URL || process.env.URL || "https://drpaystub.net";
const LOGO_URL = `${APP_URL}/logo192.png`;

let emailClient = null;
let configured = false;

(async function initEmail() {
  if (!ACS_CONNECTION_STRING) return;
  try {
    const { EmailClient } = require("@azure/communication-email");
    emailClient = new EmailClient(ACS_CONNECTION_STRING);
    configured = true;
  } catch (err) {
    console.warn("[Webhooks] Azure email not available:", err.message);
  }
})();

async function azureSendWithAttachment(to, subject, html, attachments) {
  if (!configured || !emailClient) {
    console.log("[Webhooks] Email not configured — would send:", { to, subject });
    return;
  }
  try {
    const message = {
      senderAddress: FROM_EMAIL,
      content: { subject, html },
      recipients: { to: [{ address: to }] },
    };
    if (attachments && attachments.length > 0) {
      message.attachments = attachments;
    }
    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();
    console.log("[Webhooks] Email sent:", result.status);
  } catch (error) {
    console.error("[Webhooks] Email send failed:", error.message);
  }
}

// ─── Branded Email Template ─────────────────────────────────────────────────
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
      <img src="${LOGO_URL}" alt="Saurellius" width="44" height="44" style="display:block;border:0;border-radius:12px" />
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
    <a href="${APP_URL}/privacyPolicy" style="color:#475569;text-decoration:none">Privacy</a>
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

// Shopify webhook removed — checkout is now powered by Stripe.
// Email delivery functions (brandedEmail, azureSendWithAttachment) are kept
// as they may be reused by other routes.

module.exports = router;
module.exports.brandedEmail = brandedEmail;
module.exports.azureSendWithAttachment = azureSendWithAttachment;
