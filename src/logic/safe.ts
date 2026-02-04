/**
 * Wraps an object to make all property access safe (returns undefined instead of throwing).
 * Creates a proxy that handles undefined/null gracefully.
 *
 * @example
 * const safeUser = safe(user)
 * const city = safeUser.address.city.name // undefined if any part is missing
 *
 * // Instead of:
 * const city = user?.address?.city?.name
 */
export function safe<T extends object>(obj: T | null | undefined): SafeProxy<T> {
  const handler: ProxyHandler<object> = {
    get(target, prop) {
      if (target === null || target === undefined) {
        return createNullProxy()
      }

      const value = (target as Record<PropertyKey, unknown>)[prop]

      if (value === null || value === undefined) {
        return createNullProxy()
      }

      if (typeof value === 'object') {
        return new Proxy(value as object, handler)
      }

      return value
    },
  }

  if (obj === null || obj === undefined) {
    return createNullProxy() as SafeProxy<T>
  }

  return new Proxy(obj, handler) as SafeProxy<T>
}

function createNullProxy(): unknown {
  const handler: ProxyHandler<object> = {
    get() {
      return createNullProxy()
    },
  }
  return new Proxy({}, handler)
}

/**
 * Unwraps a safe proxy to get the actual value (or undefined).
 *
 * @example
 * const safeUser = safe(user)
 * const city = unwrap(safeUser.address.city) // string | undefined
 */
export function unwrap<T>(value: T): T | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'object' && Object.keys(value as object).length === 0) {
    return undefined
  }
  return value
}

type SafeProxy<T> = T extends object
  ? { [K in keyof T]: SafeProxy<T[K]> }
  : T | undefined
