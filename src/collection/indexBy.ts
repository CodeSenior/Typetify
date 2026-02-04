/**
 * Creates an object indexed by a key function.
 * If multiple items have the same key, the last one wins.
 *
 * @example
 * const users = [
 *   { id: 1, name: 'Alice' },
 *   { id: 2, name: 'Bob' },
 * ]
 * indexBy(users, user => user.id)
 * // { 1: { id: 1, name: 'Alice' }, 2: { id: 2, name: 'Bob' } }
 */
export function indexBy<T, K extends PropertyKey>(
  array: readonly T[],
  keyFn: (item: T) => K
): Record<K, T> {
  const result = {} as Record<K, T>

  for (const item of array) {
    const key = keyFn(item)
    result[key] = item
  }

  return result
}
