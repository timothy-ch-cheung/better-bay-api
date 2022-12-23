import { describe, test, beforeEach } from '@jest/globals'
import { cheapestItemHandler, healthcheck } from './handlers.js'
import { CheapestItemRequest } from './types.js'
import express from 'express'
import { stubInterface } from 'ts-sinon'
import assert from 'assert'
import { BetterBayClient, BetterBayItem } from 'better-bay-common'
import sinon from 'sinon'

describe('Handlers', () => {
  describe('Cheapest Items', () => {
    let cheapestItems: Record<string, BetterBayItem>

    beforeEach(() => {
      const item: BetterBayItem = {
        id: '123',
        title: 'Item name',
        description: { colour: 'blue' },
        price: '999',
        currency: 'GBP'
      }
      cheapestItems = { '123': item }
    })

    test('Should throw error when query parameter incorrectly formatted', () => {
      const req: CheapestItemRequest = {
        query: {
          ids: '123|456|789'
        }
      }

      const res = stubInterface<express.Response>()
      const client = stubInterface<BetterBayClient>()

      assert.throws(
        async () => await cheapestItemHandler(req, res, client),
        Error,
        "Query param 'ids' is null or malformed."
      )
      sinon.assert.notCalled(res.send)
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
  })
})
