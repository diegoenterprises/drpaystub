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

module.exports = router;
