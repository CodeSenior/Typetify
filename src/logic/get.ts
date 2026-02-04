/**
 * Safely gets a nested property value using a path.
 * Replaces: `obj?.a?.b?.c`
 *
 * @example
 * const city = get(user, 'address', 'city')
 * // Instead of: user?.address?.city
 *
 * const firstItem = get(data, 'items', 0, 'name')
 * // Instead of: data?.items?.[0]?.name
 */
export function get<T>(
  obj: unknown,
  ...path: readonly PropertyKey[]
): T | undefined {
  let current: unknown = obj

  for (const key of path) {
    if (current === null || current === undefined) {
      return undefined
    }
    current = (current as Record<PropertyKey, unknown>)[key]
  }

  return current as T | undefined
}

/**
 * Type-safe get for known object structures.
 *
 * @example
 * interface User { profile: { name: string } }
 * const name = getTyped<User, string>(user, ['profile', 'name'])
 */
export function getTyped<T, R>(
  obj: T,
  path: readonly PropertyKey[]
): R | undefined {
  return get<R>(obj, ...path)
}

/**
 * Gets a value using a dot-notation path string.
 *
 * @example
 * const city = getPath(user, 'address.city')
 * const item = getPath(data, 'items.0.name')
 */
export function getPath<T>(
  obj: unknown,
  path: string
): T | undefined {
  const keys = path.split('.').map((k) => {
    const num = Number(k)
    return Number.isNaN(num) ? k : num
  })
  return get<T>(obj, ...keys)
}
