/**
 * Smart Cache - Intelligent caching with TTL and invalidation
 */

export interface CacheOptions<K extends unknown[], V> {
  /** Time to live in milliseconds or string like '5m', '1h', '1d' */
  ttl?: number | string
  /** Maximum cache size */
  maxSize?: number
  /** Custom key generator */
  key?: (...args: K) => string
  /** Events that invalidate the cache */
  invalidateOn?: string[]
  /** Called when cache is hit */
  onHit?: (key: string, value: V) => void
  /** Called when cache is missed */
  onMiss?: (key: string) => void
}

interface CacheEntry<V> {
  value: V
  expiresAt: number
}

function parseTTL(ttl: number | string): number {
  if (typeof ttl === 'number') return ttl
  
  const match = ttl.match(/^(\d+)(ms|s|m|h|d)$/)
  if (!match) throw new Error(`Invalid TTL format: ${ttl}`)
  
  const [, value, unit] = match
  const num = parseInt(value!, 10)
  
  switch (unit) {
    case 'ms': return num
    case 's': return num * 1000
    case 'm': return num * 60 * 1000
    case 'h': return num * 60 * 60 * 1000
    case 'd': return num * 24 * 60 * 60 * 1000
    default: return num
  }
}

/**
 * Creates a smart cache wrapper around a function.
 * 
 * @example
 * const fetchUser = smartCache(
 *   async (userId: string) => {
 *     const response = await fetch(`/api/users/${userId}`)
 *     return response.json()
 *   },
 *   { 
 *     ttl: '5m',
 *     maxSize: 100,
 *     key: (userId) => `user:${userId}`
 *   }
 * )
 * 
 * // First call - fetches from API
 * const user1 = await fetchUser('123')
 * 
 * // Second call - returns cached value
 * const user2 = await fetchUser('123')
 * 
 * // Invalidate cache
 * fetchUser.invalidate('123')
 * 
 * // Clear all cache
 * fetchUser.clear()
 */
export function smartCache<K extends unknown[], V>(
  fn: (...args: K) => V | Promise<V>,
  options: CacheOptions<K, V> = {}
): ((...args: K) => Promise<V>) & {
  invalidate: (...args: K) => void
  invalidateAll: () => void
  clear: () => void
  has: (...args: K) => boolean
  size: () => number
} {
  const {
    ttl = Infinity,
    maxSize = 1000,
    key = (...args: K) => JSON.stringify(args),
    onHit,
    onMiss,
  } = options

  const ttlMs = parseTTL(ttl)
  const cache = new Map<string, CacheEntry<V>>()

  const getKey = (...args: K): string => key(...args)

  const isExpired = (entry: CacheEntry<V>): boolean => {
    return Date.now() > entry.expiresAt
  }

  const evictOldest = (): void => {
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value
      if (firstKey) cache.delete(firstKey)
    }
  }

  const cached = async (...args: K): Promise<V> => {
    const cacheKey = getKey(...args)
    const entry = cache.get(cacheKey)

    if (entry && !isExpired(entry)) {
      onHit?.(cacheKey, entry.value)
      return entry.value
    }

    onMiss?.(cacheKey)
    
    // Remove expired entry
    if (entry) cache.delete(cacheKey)

    // Evict if at capacity
    evictOldest()

    // Fetch new value
    const value = await fn(...args)
    
    cache.set(cacheKey, {
      value,
      expiresAt: Date.now() + ttlMs,
    })

    return value
  }

  cached.invalidate = (...args: K): void => {
    const cacheKey = getKey(...args)
    cache.delete(cacheKey)
  }

  cached.invalidateAll = (): void => {
    cache.clear()
  }

  cached.clear = cached.invalidateAll

  cached.has = (...args: K): boolean => {
    const cacheKey = getKey(...args)
    const entry = cache.get(cacheKey)
    return entry !== undefined && !isExpired(entry)
  }

  cached.size = (): number => cache.size

  return cached
}

/**
 * Creates a simple memoization cache (no TTL, infinite size).
 * 
 * @example
 * const expensive = memoize((n: number) => {
 *   console.log('Computing...')
 *   return n * n
 * })
 * 
 * expensive(5) // Logs "Computing...", returns 25
 * expensive(5) // Returns 25 (cached)
 */
export function memoize<K extends unknown[], V>(
  fn: (...args: K) => V
): (...args: K) => V {
  const cache = new Map<string, V>()

  return (...args: K): V => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}
