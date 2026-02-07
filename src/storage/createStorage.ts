/**
 * Type-safe storage wrapper with serialization.
 *
 * @example
 * // Create typed storage
 * interface UserPrefs {
 *   theme: 'light' | 'dark';
 *   language: string;
 *   notifications: boolean;
 * }
 *
 * const prefs = createStorage<UserPrefs>('user-prefs', {
 *   storage: localStorage
 * });
 *
 * prefs.set({ theme: 'dark', language: 'en', notifications: true });
 * const theme = prefs.get()?.theme; // 'dark' | undefined
 *
 * @example
 * // With default value
 * const settings = createStorage('settings', {
 *   storage: localStorage,
 *   defaultValue: { volume: 50 }
 * });
 *
 * @example
 * // Session storage
 * const tempData = createStorage('temp', {
 *   storage: sessionStorage
 * });
 */
export interface StorageOptions<T> {
  storage: Storage
  defaultValue?: T
  serializer?: {
    stringify: (value: T) => string
    parse: (value: string) => T
  }
}

export interface TypedStorage<T> {
  get(): T | null
  set(value: T): void
  remove(): void
  clear(): void
  has(): boolean
}

export function createStorage<T>(key: string, options: StorageOptions<T>): TypedStorage<T> {
  const { storage, defaultValue, serializer = JSON } = options

  return {
    get(): T | null {
      try {
        const item = storage.getItem(key)
        if (item === null) {
          return defaultValue ?? null
        }
        return serializer.parse(item)
      } catch {
        return defaultValue ?? null
      }
    },

    set(value: T): void {
      try {
        const serialized = serializer.stringify(value)
        storage.setItem(key, serialized)
      } catch (error) {
        console.error(`Failed to set storage key "${key}":`, error)
      }
    },

    remove(): void {
      storage.removeItem(key)
    },

    clear(): void {
      storage.clear()
    },

    has(): boolean {
      return storage.getItem(key) !== null
    },
  }
}

/**
 * Creates a storage instance with localStorage.
 *
 * @example
 * const userPrefs = localStorageTyped<UserPrefs>('prefs');
 * userPrefs.set({ theme: 'dark' });
 */
export function localStorageTyped<T>(key: string, defaultValue?: T): TypedStorage<T> {
  return createStorage(key, { storage: localStorage, defaultValue }) as TypedStorage<T>
}

/**
 * Creates a storage instance with sessionStorage.
 *
 * @example
 * const tempData = sessionStorageTyped<TempData>('temp');
 * tempData.set({ token: 'abc123' });
 */
export function sessionStorageTyped<T>(key: string, defaultValue?: T): TypedStorage<T> {
  return createStorage(key, { storage: sessionStorage, defaultValue }) as TypedStorage<T>
}
