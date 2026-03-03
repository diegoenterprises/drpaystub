require('dotenv').config();


module.exports =  {
    shopifyApiKey: process.env.SHOPIFY_API_PUBLIC_KEY ,
    shopifyApiSecret: process.env.SHOPIFY_API_SECRET_KEY,
    shopifyStoreName: process.env.SHOPIFY_API_STORE_NAME,
}