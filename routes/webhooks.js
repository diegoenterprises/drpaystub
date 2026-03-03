const express = require('express');
const router = express.Router();

const crypto = require('crypto');
const fs = require('fs');
const secretKey = 'f3f409d22b86a6a65cdd3287acf664527f77751c50346b93a8d9f7a60a354e16';

const sendGridApiKey = `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`;
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sendGridApiKey);

const getMessagePayload = (email, file) => {
    const attachment = fs.readFileSync('public/' + file).toString('base64');

    return {
        to: email,
        from: {
            name: 'Dr Paystub',
            email: 'diego@drpaystub.net',
        },
        subject: 'Get you Paystub files',
        html: `     
            <div>
                <p>Thank you for shopping with us! Whether you loved it or not, please write a review about your Dr. Paystub Corp Reliable Paystub. We'd love to get your feedback to share with other customers on <a href="https://www.drpaystub.net/">Drpaystub.net</a></p>
                <p>If you need help or want to contact customer service, please call 530.456.6135 or email us at support@drpaystub.net for additional support.</p>
                
             </div>
        `,
        attachments: [
            {
                content: attachment,
                filename: 'attachment.zip',
                type: 'application/zip',
                disposition: 'attachment',
            },
        ],
    };
};

router.post('/', async (req, res) => {
    // We'll compare the hmac to our own hash

    try {
        const hmac = req.get('X-Shopify-Hmac-Sha256');

        // Create a hash using the body and our key
        const hash = crypto.createHmac('sha256', secretKey).update(req.rawBody).digest('base64');

        // Compare our hash to Shopify's hash
        if (hash === hmac) {
            // It's a match! All good

            console.log('it came from Shopify!');
            const { completed_at, email, note_attributes } = req.body;

            console.log(req.body);
            const { value: zipFileName } = (note_attributes || []).find(el => el.name === 'file');

            console.log(email, zipFileName);

            if (completed_at && zipFileName) {
                sgMail
                    .send(getMessagePayload(email, zipFileName))
                    .then(data => {
                        console.log(data);
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }

            res.sendStatus(200);
        } else {
            // No match! This request didn't originate from Shopify
            console.log('Danger! Not from Shopify!');
            res.sendStatus(403);
        }
    } catch (error) {
        console.log('Error from webhook');
        res.sendStatus(200);
    }
});

module.exports = router;
