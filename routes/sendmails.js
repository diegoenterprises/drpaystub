const express = require('express');
const router = express.Router();

// ─── Azure Communication Services Email ─────────────────────────────────────
const ACS_CONNECTION_STRING = process.env.AZURE_EMAIL_CONNECTION_STRING || "";
const FROM_EMAIL = process.env.FROM_EMAIL || "DoNotReply@drpaystub.net";
const ADMIN_EMAIL = "diego@drpaystub.net";
const APP_URL = process.env.FRONTEND_URL || process.env.URL || "https://drpaystub.net";
const LOGO_URL = `${APP_URL}/logo192.png`;

let emailClient = null;
let configured = false;

(async function initEmail() {
  if (!ACS_CONNECTION_STRING) {
    console.warn("[Sendmails] AZURE_EMAIL_CONNECTION_STRING not set — emails will be logged only");
    return;
  }
  try {
    const { EmailClient } = require("@azure/communication-email");
    emailClient = new EmailClient(ACS_CONNECTION_STRING);
    configured = true;
    console.log("[Sendmails] Azure Email configured");
  } catch (err) {
    console.warn("[Sendmails] @azure/communication-email not available:", err.message);
  }
})();

async function azureSend(options) {
  if (!configured || !emailClient) {
    console.log("[Sendmails] NOT configured — would send:", { to: options.to, subject: options.subject });
    return false;
  }
  try {
    const message = {
      senderAddress: FROM_EMAIL,
      content: { subject: options.subject, html: options.html || "", plainText: options.text || "" },
      recipients: { to: [{ address: options.to }] },
    };
    const poller = await emailClient.beginSend(message);
    const result = await poller.pollUntilDone();
    return result.status === "Succeeded";
  } catch (error) {
    console.error("[Sendmails] Azure send failed:", error.message);
    return false;
  }
}

// ─── Branded Email Template (matches email.service.js design language) ───────
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

router.post('/contact', async function (req, res) {
    const html = brandedEmail("New Contact Request", `
      <p style="margin:0 0 16px;color:#CBD5E1">A new contact form submission has been received:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px">
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#64748B;font-size:13px;font-weight:600;width:80px">Name</td>
          <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#E2E8F0;font-size:14px">${req.body.name}</td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#64748B;font-size:13px;font-weight:600">Email</td>
          <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#E2E8F0;font-size:14px"><a href="mailto:${req.body.email}" style="color:#a78bfa;text-decoration:none">${req.body.email}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#64748B;font-size:13px;font-weight:600">Subject</td>
          <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#E2E8F0;font-size:14px">${req.body.subject}</td>
        </tr>
      </table>
      <p style="margin:0 0 8px;color:#E2E8F0;font-weight:600;font-size:15px">Message</p>
      <p style="margin:0;color:#CBD5E1;font-size:14px;line-height:1.7;background:rgba(15,23,42,0.5);padding:16px;border-radius:10px">${req.body.message}</p>
    `);

    try {
        const sent = await azureSend({
            to: ADMIN_EMAIL,
            subject: `Dr.Paystub, New Contact Request!`,
            html,
        });
        if (sent) {
            res.status(200).json({ msg: 'OK', mailSent: true });
        } else {
            res.status(400).json({ msg: 'OK', mailSent: false });
        }
    } catch (err) {
        console.error('[Contact] error:', err.message);
        res.status(400).json({ msg: 'OK', mailSent: false });
    }
});

router.post('/newsletter', async function (req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ msg: 'Email is required', mailSent: false });
    }

    try {
        // Send notification to admin
        const adminHtml = brandedEmail("New Newsletter Subscriber", `
          <p style="margin:0 0 16px;color:#CBD5E1">A new user has subscribed to the newsletter:</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
            <tr>
              <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#64748B;font-size:13px;font-weight:600;width:80px">Email</td>
              <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#E2E8F0;font-size:14px"><a href="mailto:${email}" style="color:#a78bfa;text-decoration:none">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#64748B;font-size:13px;font-weight:600">Date</td>
              <td style="padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.06);color:#E2E8F0;font-size:14px">${new Date().toLocaleString()}</td>
            </tr>
          </table>
        `);

        await azureSend({
            to: ADMIN_EMAIL,
            subject: 'Dr.Paystub — New Newsletter Subscriber!',
            html: adminHtml,
        });

        // Send welcome email to subscriber
        const welcomeHtml = brandedEmail("Welcome to the Newsletter!", `
          <p style="margin:0 0 16px;color:#CBD5E1">Thank you for subscribing to the <strong style="color:#E2E8F0">Saurellius</strong> newsletter!</p>
          <p style="margin:0 0 16px;color:#CBD5E1">You'll be the first to know about:</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
            <tr>
              <td style="width:32px;height:32px;background:rgba(124,92,252,0.12);border-radius:8px;text-align:center;vertical-align:middle;font-size:14px">&#10024;</td>
              <td style="padding-left:12px;color:#CBD5E1;font-size:14px;line-height:1.5">New payroll features and templates</td>
            </tr>
            <tr><td colspan="2" style="height:8px"></td></tr>
            <tr>
              <td style="width:32px;height:32px;background:rgba(124,92,252,0.12);border-radius:8px;text-align:center;vertical-align:middle;font-size:14px">&#128200;</td>
              <td style="padding-left:12px;color:#CBD5E1;font-size:14px;line-height:1.5">Tax season updates and tips</td>
            </tr>
            <tr><td colspan="2" style="height:8px"></td></tr>
            <tr>
              <td style="width:32px;height:32px;background:rgba(124,92,252,0.12);border-radius:8px;text-align:center;vertical-align:middle;font-size:14px">&#127873;</td>
              <td style="padding-left:12px;color:#CBD5E1;font-size:14px;line-height:1.5">Exclusive promotions</td>
            </tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px">
          <tr><td align="center">
            <a href="${APP_URL}" style="display:inline-block;padding:14px 36px;background:linear-gradient(135deg,#7c5cfc,#a78bfa);color:#FFFFFF;font-size:14px;font-weight:600;text-decoration:none;border-radius:12px;letter-spacing:0.2px">Visit Saurellius</a>
          </td></tr>
          </table>
          <p style="margin:16px 0 0;font-size:12px;color:#475569">— The Saurellius Team at Dr. Paystub Corp</p>
        `);

        await azureSend({
            to: email,
            subject: 'Welcome to the Saurellius Newsletter!',
            html: welcomeHtml,
        });

        res.status(200).json({ msg: 'OK', mailSent: true });
    } catch (err) {
        console.error('[Newsletter] error:', err.message);
        res.status(400).json({ msg: 'Failed', mailSent: false });
    }
});

module.exports = router;
