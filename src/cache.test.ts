import { Cache } from './cache.js'
import { BetterBayItemResponse } from 'better-bay-common'

describe('Cache', () => {
  let cache: Cache
  const mockItem: BetterBayItemResponse = {
    id: '123',
    title: 'Item name',
    description: { colour: 'blue' },
    price: '999',
    currency: 'GBP'
  }

  beforeEach(() => {
    cache = new Cache()
  })

  describe('Get', () => {
    test('Cache miss', () => {
      expect(cache.get(['789'])).toEqual({ items: {}, missed: ['789'] })
    })

    test('Expired cache hit', () => {
      const oldItem = {
        timeAdded: new Date('December 17, 1995 03:24:00'),
        item: mockItem
      }
      cache._cache.set('123', oldItem)
      expect(cache.get(['123'])).toEqual({ items: {}, missed: ['123'] })
    })

    test('Cache hit', () => {
      cache.set({ 123: mockItem })

      const cachedItem = cache.get(['123'])
      expect(cachedItem.missed).toEqual([])
      expect(cachedItem.items).toEqual({ 123: mockItem })
    })
  })

  describe('Set', () => {
    test('Item', () => {
      cache.set({ 123: mockItem })

      const cachedItem = cache._cache.get('123')
      expect(cachedItem?.timeAdded).toBeDefined()
      expect(cachedItem?.item).toEqual(mockItem)
    })
  })

  describe('Clear', () => {
    test('Item', () => {
      cache.set({ 123: mockItem })
      cache.clear()

      expect(cache._cache.size).toEqual(0)
    })
  })
})
