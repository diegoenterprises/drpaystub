const express = require('express');
const router = express.Router();
const config = require('../config/default.json');
const sendgrid = require('@sendgrid/mail');

const sendgrid_api = config.sendgridAPI;
const sender_email = config.sendgridSender;
sendgrid.setApiKey(sendgrid_api);

router.post('/contact', function (req, res, next) {
    const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
      <li>Subject: ${req.body.subject}</li>
      
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
    const emailOptions = {
        to: sender_email,
        from: sender_email,
        subject: `Dr.Paystub, New Contact Request!`,
        html: output,
    };

    sendgrid.send(emailOptions, (err, result) => {
        if (err) {
            res.status(400).json({ msg: 'OK', mailSent: false });
        } else {
            res.status(200).json({ msg: 'OK', mailSent: true });
        }
    });
});

router.post('/newsletter', function (req, res, next) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ msg: 'Email is required', mailSent: false });
    }

    // Send notification to admin
    const adminEmail = {
        to: sender_email,
        from: sender_email,
        subject: 'Dr.Paystub — New Newsletter Subscriber!',
        html: `
            <h3>New Newsletter Subscription</h3>
            <p>A new user has subscribed to the newsletter:</p>
            <ul>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
            </ul>
        `,
    };

    // Send welcome email to subscriber
    const welcomeEmail = {
        to: email,
        from: sender_email,
        subject: 'Welcome to the Saurellius Newsletter!',
        html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; padding: 40px 24px;">
                <h2 style="color: #1a1a2e; margin-bottom: 8px;">Welcome to Saurellius!</h2>
                <p style="color: #555; font-size: 15px; line-height: 1.6;">
                    Thank you for subscribing to our newsletter. You'll be the first to know about:
                </p>
                <ul style="color: #555; font-size: 14px; line-height: 1.8;">
                    <li>New payroll features and templates</li>
                    <li>Tax season updates and tips</li>
                    <li>Exclusive promotions</li>
                </ul>
                <p style="color: #888; font-size: 13px; margin-top: 32px;">
                    — The Saurellius Team at Dr. Paystub Corp
                </p>
            </div>
        `,
    };

    sendgrid.send(adminEmail)
        .then(() => sendgrid.send(welcomeEmail))
        .then(() => {
            res.status(200).json({ msg: 'OK', mailSent: true });
        })
        .catch((err) => {
            console.error('[Newsletter] SendGrid error:', err?.response?.body || err.message);
            res.status(400).json({ msg: 'Failed', mailSent: false });
        });
});

module.exports = router;
