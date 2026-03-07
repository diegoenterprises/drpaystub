const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    return res.status(200).json({ articles: [] });
});

router.get('/:id', async (req, res) => {
    return res.status(404).json({ msg: "Article not found", success: false });
});

module.exports = router;
