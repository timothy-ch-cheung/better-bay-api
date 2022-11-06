import dotenv from "dotenv";
import express from "express";
import { buildBetterBayClient } from "better-bay-common";
dotenv.config();
const app = express();
const port = 3000;
export const client = await buildBetterBayClient(process.env.EBAY_CLIENT_ID || "", process.env.EBAY_CLIENT_SECRET || "", process.env.EBAY_REDIRECT_URI || "", true);
const idsRegex = /(\d+,)*(\d+)/;
export function cheapestItemHandler(req, res) {
    const itemIds = req.query.ids;
    if (!itemIds || !idsRegex.test(itemIds)) {
        throw new Error("Query param 'ids' is null or malformed.");
    }
    const itemIdList = itemIds.split(",");
    client.getCheapestItems(itemIdList).then((items) => {
        res.send(items);
    });
}
app.get('/v1/items/cheapest', cheapestItemHandler);
app.listen(port, () => console.log(`Better Bay API listening on port ${port}!`));
