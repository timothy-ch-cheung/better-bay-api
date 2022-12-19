import { BetterBayClient } from "better-bay-common";
import { CheapestItemRequest, HealthCheck } from "./types.js"
import express from "express"

const idsRegex = /^(\d+,)*(\d+)$/

export function cheapestItemHandler(req: CheapestItemRequest, res: express.Response, client: BetterBayClient) {
    const itemIds = req.query.ids

    if (!itemIds || !idsRegex.test(itemIds)) {
        throw new Error("Query param 'ids' is null or malformed.")
    }

    const itemIdList: string[] = itemIds.split(",")

    return new Promise(async (resolve, reject) => {
        let cheapestItems = await client.getCheapestItems(itemIdList)
        resolve(res.send(cheapestItems))
    })
}

export function healthcheck(req: any, res: express.Response, client: BetterBayClient) {
    return new Promise(async (resolve, reject) => {
        const status = await client.healthCheck();
        if (status.cheapestItem.remaining > 0) {
            resolve(res.send({ status: "HEALTHY", code: 200 }));
        } else {
            resolve(res.send({ status: "UNHEALTHY", code: 503 }));
        }
    })
}