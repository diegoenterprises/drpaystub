const { default: axios } = require('axios');
const express = require('express');
const router = express.Router();
const { shopifyAdminURI: shopifyURL } = require('../config/default.json');

router.get('/', async (req, res, next) => {
    return axios
        .get(`${shopifyURL}/admin/api/2021-01/blogs/75486953641/articles.json`)
        .then(result => {
            res.status(200).json(result.data);
        })
        .catch(err => {
            res.status(400).json({ msg: err, success: false });
        });
});

router.get('/:id', async (req, res, next) => {
    let articleId = req.params.id;

    return axios
        .get(`${shopifyURL}/admin/api/2021-01/blogs/75486953641/articles/${articleId}.json`)
        .then(result => {
            return res.status(200).json(result.data);
        })
        .catch(err => {
            return res.status(400).json({ msg: err, success: false });
        });
});
module.exports = router;
