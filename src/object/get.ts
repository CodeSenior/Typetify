/**
 * Safely gets a nested property from an object.
 * Returns undefined if the path doesn't exist.
 *
 * @example
 * const user = { profile: { name: 'John' } }
 * get(user, ['profile', 'name']) // 'John'
 * get(user, ['profile', 'age']) // undefined
 */
export function get<T>(
  obj: unknown,
  path: readonly PropertyKey[]
): T | undefined {
  let current: unknown = obj

  for (const key of path) {
    if (current === null || current === undefined) {
      return undefined
    }

    if (typeof current !== 'object') {
      return undefined
    }

    current = (current as Record<PropertyKey, unknown>)[key]
  }

  return current as T | undefined
}
