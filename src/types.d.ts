interface IdListQuery {
    ids: string
}

export interface CheapestItemRequest {
    query: IdListQuery
}

export interface HealthCheck {
    status: string,
    code: number
}