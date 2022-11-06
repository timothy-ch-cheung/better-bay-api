import { BetterBayClient } from "better-bay-common";
import { CheapestItemRequest } from "./types.js"
import { BetterBayItem } from "better-bay-common";
import express from "express"

const idsRegex = /^(\d+,)*(\d+)$/

export function cheapestItemHandler(req: CheapestItemRequest, res: express.Response, client: BetterBayClient) {
    const itemIds = req.query.ids

    if (!itemIds || !idsRegex.test(itemIds)) {
        throw new Error("Query param 'ids' is null or malformed.")
    }

    const itemIdList: string[] = itemIds.split(",")

    client.getCheapestItems(itemIdList).then((items: Record<string, BetterBayItem>) => {
        res.send(items);
    })
}