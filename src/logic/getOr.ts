/**
 * Safely gets a nested property value, returning a default if not found.
 * Replaces: `obj?.a?.b?.c ?? defaultValue`
 *
 * @example
 * const city = getOr(user, 'Unknown', 'address', 'city')
 * // Instead of: user?.address?.city ?? 'Unknown'
 */
export function getOr<T>(
  obj: unknown,
  defaultValue: T,
  ...path: readonly PropertyKey[]
): T {
  let current: unknown = obj

  for (const key of path) {
    if (current === null || current === undefined) {
      return defaultValue
    }
    current = (current as Record<PropertyKey, unknown>)[key]
  }

  return (current ?? defaultValue) as T
}

/**
 * Gets a value using dot-notation path, with default.
 *
 * @example
 * const city = getPathOr(user, 'Unknown', 'address.city')
 */
export function getPathOr<T>(
  obj: unknown,
  defaultValue: T,
  path: string
): T {
  const keys = path.split('.').map((k) => {
    const num = Number(k)
    return Number.isNaN(num) ? k : num
  })
  return getOr<T>(obj, defaultValue, ...keys)
}

/**
 * Lazy version - computes default only if needed.
 *
 * @example
 * const config = getOrLazy(settings, () => computeDefault(), 'theme', 'colors')
 */
export function getOrLazy<T>(
  obj: unknown,
  getDefault: () => T,
  ...path: readonly PropertyKey[]
): T {
  let current: unknown = obj

  for (const key of path) {
    if (current === null || current === undefined) {
      return getDefault()
    }
    current = (current as Record<PropertyKey, unknown>)[key]
  }

  return current !== null && current !== undefined ? (current as T) : getDefault()
}
