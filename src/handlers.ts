import { BetterBayClient } from 'better-bay-common'
import { CheapestItemRequest } from './types.js'
import express, { Response } from 'express'
import { Cache } from './cache.js'

const idsRegex = /^(\d+,)*(\d+)$/
export const cache = new Cache()

export async function cheapestItemHandler(
  req: CheapestItemRequest,
  res: express.Response,
  client: BetterBayClient
): Promise<Response<any, Record<string, any>>> {
  const itemIds = req.query.ids
  const analyse: boolean = req.query.analyse === 'true'

  if (itemIds === '' || !idsRegex.test(itemIds)) {
    throw new Error("Query param 'ids' is null or malformed.")
  }

  const itemIdList: string[] = itemIds.split(',')

  const cacheResponse = cache.get(itemIdList)
  if (cacheResponse.missed.length === 0) {
    return res.send(cacheResponse.items)
  }

  const cheapestItemsPromise = client.getCheapestItems(
    cacheResponse.missed,
    analyse
  )
  return await new Promise((resolve, reject) => {
    cheapestItemsPromise
      .then((cheapestItems) => {
        cache.set(cheapestItems)
        const cacheApiCombinedItems = {
          ...cacheResponse.items,
          ...cheapestItems
        }
        resolve(res.send(cacheApiCombinedItems))
      })
      .catch((error: Error) => {
        reject(error)
      })
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
        reject(error)
      })
  })
}
