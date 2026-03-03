const express = require('express');
const router = express.Router();

const { saveW2 } = require('../utils');

router.post('/', async (req, res, next) => {
    const { checkoutId, image } = req.body;

    const zipFile = await saveW2({
        base64: image,
        checkoutId,
    });

    return res.json({
        success: true,
        zipFile,
    });
});

module.exports = router;
