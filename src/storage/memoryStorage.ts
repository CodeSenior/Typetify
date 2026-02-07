/**
 * In-memory storage implementation (useful for SSR/testing).
 *
 * @example
 * // Use in Node.js or SSR
 * const storage = createMemoryStorage();
 * storage.setItem('key', 'value');
 * storage.getItem('key'); // => 'value'
 *
 * @example
 * // Fallback when localStorage is not available
 * const storage = typeof window !== 'undefined'
 *   ? localStorage
 *   : createMemoryStorage();
 *
 * @example
 * // Testing
 * const mockStorage = createMemoryStorage();
 * const store = createStorage('test', { storage: mockStorage });
 */
export function createMemoryStorage(): Storage {
  const store = new Map<string, string>()

  return {
    get length(): number {
      return store.size
    },

    getItem(key: string): string | null {
      return store.get(key) ?? null
    },

    setItem(key: string, value: string): void {
      store.set(key, value)
    },

    removeItem(key: string): void {
      store.delete(key)
    },

    clear(): void {
      store.clear()
    },

    key(index: number): string | null {
      const keys = Array.from(store.keys())
      return keys[index] ?? null
    },
  }
}
