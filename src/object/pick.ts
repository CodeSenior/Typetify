/**
 * Creates a new object with only the specified keys.
 * Type-safe alternative to lodash pick.
 *
 * @example
 * const user = { id: 1, name: 'John', email: 'john@example.com' }
 * const picked = pick(user, ['id', 'name'])
 * // { id: 1, name: 'John' }
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>

  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key]
    }
  }

  return result
}
