/**
 * Groups array elements by a key function.
 *
 * @example
 * const users = [
 *   { name: 'Alice', role: 'admin' },
 *   { name: 'Bob', role: 'user' },
 *   { name: 'Charlie', role: 'admin' },
 * ]
 * groupBy(users, user => user.role)
 * // { admin: [{ name: 'Alice', ... }, { name: 'Charlie', ... }], user: [{ name: 'Bob', ... }] }
 */
export function groupBy<T, K extends PropertyKey>(
  array: readonly T[],
  keyFn: (item: T) => K
): Record<K, T[]> {
  const result = {} as Record<K, T[]>

  for (const item of array) {
    const key = keyFn(item)
    if (!(key in result)) {
      result[key] = []
    }
    result[key].push(item)
  }

  return result
}
