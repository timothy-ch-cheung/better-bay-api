
import dotenv from "dotenv"
import express from "express"
import { buildBetterBayClient } from "better-bay-common"
import { CheapestItemRequest } from "./types.js"
import { BetterBayItem } from "better-bay-common";
dotenv.config();
const app = express();
const port = 3000;

const client = await buildBetterBayClient(
    process.env.EBAY_CLIENT_ID || "",
    process.env.EBAY_CLIENT_SECRET || "",
    process.env.EBAY_REDIRECT_URI || "",
    true
);

const idsRegex = /(\d+,)*(\d+)/

app.get('/v1/items/cheapest', (req: CheapestItemRequest, res: express.Response) => {
    const itemIds = req.query.ids

    if (!itemIds || !idsRegex.test(itemIds)) {
        throw new Error("Query param 'ids' is null or malformed.")
    }

    const itemIdList: string[] = itemIds.split(",")

    client.getCheapestItems(itemIdList).then((items: Record<string, BetterBayItem>) => {
        res.send(items);
    })

});

app.listen(port, () => console.log(`Better Bay API listening on port ${port}!`))
