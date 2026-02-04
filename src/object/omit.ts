/**
 * Creates a new object without the specified keys.
 * Type-safe alternative to lodash omit.
 *
 * @example
 * const user = { id: 1, name: 'John', password: 'secret' }
 * const safe = omit(user, ['password'])
 * // { id: 1, name: 'John' }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Omit<T, K> {
  const result = { ...obj }
  const keysSet = new Set<PropertyKey>(keys)

  for (const key of keysSet) {
    delete (result as Record<PropertyKey, unknown>)[key]
  }

  return result as Omit<T, K>
}
