import { BetterBayItemResponse } from 'better-bay-common'

interface CachedBetterBayItem {
  timeAdded: Date
  item: BetterBayItemResponse
}

interface CacheResponse {
  items: Record<string, BetterBayItemResponse>
  missed: string[]
}

export function diffHours(date1: Date, date2: Date): number {
  const diff = Math.abs(Math.floor(date1.getTime() - date2.getTime()))
  return Math.round(diff / 3600000)
}

export class Cache {
  _cache: Map<string, CachedBetterBayItem>

  constructor() {
    this._cache = new Map()
  }

  get(itemIds: string[]): CacheResponse {
    const currentTime = new Date()
    const fetchedItems: Record<string, BetterBayItemResponse> = {}
    const missedIds = []
    for (const id of itemIds) {
      const cachedItem = this._cache.get(id)

      if (cachedItem === undefined) {
        missedIds.push(id)
        continue
      }

      const diff = diffHours(currentTime, cachedItem.timeAdded)
      if (diff < 24) {
        fetchedItems[id] = cachedItem.item
      } else {
        missedIds.push(id)
      }
    }
    return {
      items: fetchedItems,
      missed: missedIds
    }
  }

  set(items: Record<string, BetterBayItemResponse>): void {
    const currentTime = new Date()
    Object.entries(items).forEach(([id, betterBayItem]) => {
      this._cache.set(id, { timeAdded: currentTime, item: betterBayItem })
    })
  }

  clear(): void {
    this._cache.clear()
  }
}
