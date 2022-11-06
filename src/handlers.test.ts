import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { cheapestItemHandler } from './handlers.js'
import { CheapestItemRequest } from "./types.js"
import express from "express"
import { stubInterface } from "ts-sinon"
import assert from "assert"
import { BetterBayClient } from 'better-bay-common';

describe('Cheapest Items', () => {

    test('Should throw error when query parameter incorrectly formatted', () => {
        const req: CheapestItemRequest = {
            query: {
                ids: "123|456|789"
            }
        }

        const res = stubInterface<express.Response>()
        const client = stubInterface<BetterBayClient>()

        assert.throws(() => cheapestItemHandler(req, res, client), Error);
    })
})