import { cheapestItemHandler, healthcheck, cache } from './handlers.js'
import { CheapestItemRequest } from './types.js'
import express from 'express'
import { BetterBayClient, BetterBayItemResponse } from 'better-bay-common'
import sinon from 'sinon'
import { stubInterface } from 'ts-sinon'

describe('Handlers', () => {
  beforeEach(() => {
    cache.clear()
  })

  describe('Cheapest Items', () => {
    let cheapestItems: Record<string, BetterBayItemResponse>

    beforeEach(() => {
      const item: BetterBayItemResponse = {
        id: '123',
        title: 'Item name',
        description: { colour: 'blue' },
        price: '999',
        currency: 'GBP'
      }
      cheapestItems = { '123': item }
    })

    test('Should throw error when query parameter incorrectly formatted', async () => {
      const req: CheapestItemRequest = {
        query: {
          ids: '123|456|789'
        }
      }

      const res = stubInterface<express.Response>()
      const client = stubInterface<BetterBayClient>()

      await expect(cheapestItemHandler(req, res, client)).rejects.toEqual(
        new Error("Query param 'ids' is null or malformed.")
      )
      sinon.assert.notCalled(res.send)
    })

    test('API Call fails', async () => {
      const req: CheapestItemRequest = {
        query: {
          ids: '123,456,789'
        }
      }

      const res = stubInterface<express.Response>()
      const client = stubInterface<BetterBayClient>()
      client.getCheapestItems.rejects(new Error('API Call failed'))

      await expect(cheapestItemHandler(req, res, client)).rejects.toEqual(
        new Error('API Call failed')
      )
    })

    test('Get cheapest item', async () => {
      const req: CheapestItemRequest = {
        query: {
          ids: '123,456,789'
        }
      }

      const res = stubInterface<express.Response>()
      const client = stubInterface<BetterBayClient>()
      client.getCheapestItems.returns(
        new Promise((resolve) => resolve(cheapestItems))
      )

      const cheapestItemPromise = cheapestItemHandler(req, res, client)

      return await cheapestItemPromise.then(() => {
        sinon.assert.calledOnceWithExactly(res.send, cheapestItems)
      })
    })

    test('Get cheapest item, cached', async () => {
      const req: CheapestItemRequest = {
        query: {
          ids: '123'
        }
      }

      cache.set({
        123: {
          id: '123',
          title: 'Item name',
          description: { colour: 'blue' },
          price: '999',
          currency: 'GBP'
        }
      })

      const res = stubInterface<express.Response>()
      const client = stubInterface<BetterBayClient>()

      const cheapestItemPromise = cheapestItemHandler(req, res, client)

      return await cheapestItemPromise.then(() => {
        sinon.assert.calledOnceWithExactly(res.send, cheapestItems)
        sinon.assert.notCalled(client.getCheapestItems)
      })
    })

    test('Anaylse is called with Get cheapest item', async () => {
      const req: CheapestItemRequest = {
        query: {
          ids: '123,456,789',
          analyse: 'true'
        }
      }

      const res = stubInterface<express.Response>()
      const client = stubInterface<BetterBayClient>()
      client.getCheapestItems.returns(
        new Promise((resolve) => resolve(cheapestItems))
      )

      const cheapestItemPromise = cheapestItemHandler(req, res, client)

      return await cheapestItemPromise.then(() => {
        sinon.assert.calledOnceWithExactly(res.send, cheapestItems)
        sinon.assert.calledOnceWithExactly(
          client.getCheapestItems,
          ['123', '456', '789'],
          true
        )
      })
    })
  })

  describe('Health Check', () => {
    test('200 OK', async () => {
      const res = stubInterface<express.Response>()
      const client = stubInterface<BetterBayClient>()
      const limit = { cheapestItem: { limit: 100, remaining: 25 } }
      client.healthCheck.returns(new Promise((resolve) => resolve(limit)))

      const healthcheckPromise = healthcheck({}, res, client)

      return await healthcheckPromise.then(() => {
        sinon.assert.calledOnceWithExactly(res.send, {
          status: 'HEALTHY',
          code: 200
        })
      })
    })

    test('503 SERVICE UNAVAILABLE', async () => {
      const res = stubInterface<express.Response>()
      const client = stubInterface<BetterBayClient>()
      const limit = { cheapestItem: { limit: 100, remaining: 0 } }
      client.healthCheck.returns(new Promise((resolve) => resolve(limit)))

      const healthcheckPromise = healthcheck({}, res, client)

      return await healthcheckPromise.then(() => {
        sinon.assert.calledOnceWithExactly(res.send, {
          status: 'UNHEALTHY',
          code: 503
        })
      })
    })

    test('API call failed', async () => {
      const res = stubInterface<express.Response>()
      const client = stubInterface<BetterBayClient>()
      client.healthCheck.rejects(new Error('API call failed'))

      await expect(healthcheck({}, res, client)).rejects.toEqual(
        new Error('API call failed')
      )
    })
  })
})
