
import dotenv from "dotenv"
import express from "express"
import { buildBetterBayClient } from "better-bay-common"
dotenv.config();
const app = express();
const port = 3000;

const client = await buildBetterBayClient(
    process.env.EBAY_CLIENT_ID,
    process.env.EBAY_CLIENT_SECRET,
    process.env.EBAY_REDIRECT_URI,
    true
);

app.get('/v1/items/cheapest', (req, res) => {
    const itemIds = req.query.ids.split(',')

    client.getCheapestItems(itemIds).then(items => {
        res.send(items);
    })

});

app.listen(port, () => console.log(`Better Bay API listening on port ${port}!`))
