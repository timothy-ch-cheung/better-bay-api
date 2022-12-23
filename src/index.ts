import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import { buildBetterBayClient } from 'better-bay-common'
import { cheapestItemHandler, healthcheck } from './handlers.js'
import { CheapestItemRequest } from './types.js'

dotenv.config()
const app = express()
const port = process.env.PORT || 3000

export const client = await buildBetterBayClient(
  process.env.EBAY_CLIENT_ID || '',
  process.env.EBAY_CLIENT_SECRET || '',
  process.env.EBAY_REDIRECT_URI || '',
  true
)

const _cheapestItemHandler = function (
  req: CheapestItemRequest,
  res: express.Response
) {
  cheapestItemHandler(req, res, client)
}
const _healthcheck = function (req: any, res: express.Response) {
  healthcheck(req, res, client)
}

app.use(cors())

app.get('/v1/items/cheapest', _cheapestItemHandler)
app.get('/v1/healthcheck', _healthcheck)

app.listen(port, () => console.log(`Better Bay API listening on port ${port}!`))
