/**
 * Storage wrapper that adds expiration to stored values.
 *
 * @example
 * // Store with 1 hour expiry
 * const cache = withExpiry<User>('user-cache', {
 *   storage: localStorage,
 *   ttl: 60 * 60 * 1000 // 1 hour in ms
 * });
 *
 * cache.set(user);
 * const cached = cache.get(); // null after 1 hour
 *
 * @example
 * // Check if expired
 * if (cache.isExpired()) {
 *   cache.remove();
 *   fetchFreshData();
 * }
 *
 * @example
 * // API response caching
 * const apiCache = withExpiry<ApiResponse>('api-cache', {
 *   storage: sessionStorage,
 *   ttl: 5 * 60 * 1000 // 5 minutes
 * });
 */
export interface ExpiryStorageOptions {
  storage: Storage
  ttl: number // Time to live in milliseconds
}

export interface ExpiryStorage<T> {
  get(): T | null
  set(value: T): void
  remove(): void
  isExpired(): boolean
  getExpiry(): number | null
}

interface StoredValue<T> {
  value: T
  expiry: number
}

export function withExpiry<T>(key: string, options: ExpiryStorageOptions): ExpiryStorage<T> {
  const { storage, ttl } = options

  return {
    get(): T | null {
      try {
        const item = storage.getItem(key)
        if (item === null) return null

        const stored: StoredValue<T> = JSON.parse(item)
        const now = Date.now()

        if (now > stored.expiry) {
          storage.removeItem(key)
          return null
        }

        return stored.value
      } catch {
        return null
      }
    },

    set(value: T): void {
      try {
        const stored: StoredValue<T> = {
          value,
          expiry: Date.now() + ttl,
        }
        storage.setItem(key, JSON.stringify(stored))
      } catch (error) {
        console.error(`Failed to set expiry storage key "${key}":`, error)
      }
    },

    remove(): void {
      storage.removeItem(key)
    },

    isExpired(): boolean {
      try {
        const item = storage.getItem(key)
        if (item === null) return true

        const stored: StoredValue<T> = JSON.parse(item)
        return Date.now() > stored.expiry
      } catch {
        return true
      }
    },

    getExpiry(): number | null {
      try {
        const item = storage.getItem(key)
        if (item === null) return null

        const stored: StoredValue<T> = JSON.parse(item)
        return stored.expiry
      } catch {
        return null
      }
    },
  }
}
