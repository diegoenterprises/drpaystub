const express = require('express');
const router = express.Router();

const stateTaxes = require('../config/state-tax.json');

router.get('/', async (req, res, next) => {
    return res.json({
        success: true,
        states: Object.keys(stateTaxes),
    });
});

module.exports = router;
