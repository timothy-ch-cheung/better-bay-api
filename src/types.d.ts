interface IdListQuery {
  ids: string
  analyse?: string
}

export interface CheapestItemRequest {
  query: IdListQuery
}

export interface HealthCheck {
  status: string
  code: number
}
