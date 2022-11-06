import { describe, test, beforeEach } from '@jest/globals'
import { cheapestItemHandler } from './handlers.js'
import { CheapestItemRequest } from "./types.js"
import express from "express"
import { stubInterface } from "ts-sinon"
import assert from "assert"
import { BetterBayClient, BetterBayItem } from 'better-bay-common'
import sinon from 'sinon'

describe('Cheapest Items', () => {

    let cheapestItems: Record<string, BetterBayItem>

    beforeEach(() => {
        const item: BetterBayItem = {
            id: "123",
            title: "Item name",
            description: { "colour": "blue" },
            price: 999,
            currency: "GBP"
        }
        cheapestItems = { "123": item }
    })

    test('Should throw error when query parameter incorrectly formatted', () => {
        const req: CheapestItemRequest = {
            query: {
                ids: "123|456|789"
            }
        }

        const res = stubInterface<express.Response>()
        const client = stubInterface<BetterBayClient>()

        assert.throws(() => cheapestItemHandler(req, res, client), Error, "Query param 'ids' is null or malformed.");
        sinon.assert.notCalled(res.send)
    })

    test('Get cheapest item', () => {
        const req: CheapestItemRequest = {
            query: {
                ids: "123,456,789"
            }
        }

        const res = stubInterface<express.Response>()
        const client = stubInterface<BetterBayClient>()
        client.getCheapestItems.returns(new Promise((resolve) => resolve(cheapestItems)))

        let cheapestItemPromise = cheapestItemHandler(req, res, client)

        return cheapestItemPromise.then(test => {
            sinon.assert.calledOnceWithExactly(res.send, cheapestItems)
        })
    })
})