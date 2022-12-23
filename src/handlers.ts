import { BetterBayClient } from 'better-bay-common'
import { CheapestItemRequest } from './types.js'
import express, { Response } from 'express'

const idsRegex = /^(\d+,)*(\d+)$/

export async function cheapestItemHandler(
  req: CheapestItemRequest,
  res: express.Response,
  client: BetterBayClient
): Promise<Response<any, Record<string, any>>> {
  const itemIds = req.query.ids

  if (itemIds == null || !idsRegex.test(itemIds)) {
    throw new Error("Query param 'ids' is null or malformed.")
  }

  const itemIdList: string[] = itemIds.split(',')

  return await new Promise((resolve, reject): void => {
    const cheapestItems = client.getCheapestItems(itemIdList)
    resolve(res.send(cheapestItems))
  })
}

export async function healthcheck(
  req: any,
  res: express.Response,
  client: BetterBayClient
): Promise<Response<any>> {
  return await new Promise((resolve, reject) => {
    const statusPromise = client.healthCheck()
    statusPromise
      .then((status) => {
        if (status.cheapestItem.remaining > 0) {
          resolve(res.send({ status: 'HEALTHY', code: 200 }))
        } else {
          resolve(res.send({ status: 'UNHEALTHY', code: 503 }))
        }
      })
      .catch((error: Error) => {
        console.log(`Failed call healthcheck [${error.message}]`)
      })
  })
}
