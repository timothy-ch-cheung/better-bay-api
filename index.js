require('dotenv').config()
const express = require('express');
const EbayClient = require('ebay-oauth-nodejs-client');

const ebayAuthToken = new EbayClient({
    clientId: process.env.EBAY_CLIENT_ID,
    clientSecret: process.env.EBAY_CLIENT_SECRET,
    redirectUri: process.env.EBAY_REDIRECT_URI
});

const app = express();

const port = 3000;

app.get('/v1/items/cheapest', (req, res) => {
    res.send('WIP come back later!');
});

app.listen(port, () => console.log(`Better Bay API listening on port ${port}!`))