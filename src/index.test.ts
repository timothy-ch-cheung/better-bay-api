import { describe, expect, test, jest } from '@jest/globals';
import { cheapestItemHandler } from './index.js'
import { CheapestItemRequest } from "./types.js"
import express from "express"
import { stubObject, stubInterface } from "ts-sinon"
import { buildBetterBayClient } from "better-bay-common"

jest.mock("better-bay-common")
const mockedClient = jest.fn();
const mockedClientBuilder = jest.mocked(buildBetterBayClient, { shallow: true }).mockImplementation

describe('Cheapest Items', () => {

    test('Get cheapest item', () => {

        const req: CheapestItemRequest = {
            query: {
                ids: "123,456,789"
            }
        }

        const res = stubInterface<express.Response>()


        cheapestItemHandler(req, res);
    })
})