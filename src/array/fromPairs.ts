/**
 * Returns an object composed from key-value pairs.
 *
 * @example
 * fromPairs([['a', 1], ['b', 2]])
 * // { a: 1, b: 2 }
 */
export function fromPairs<K extends PropertyKey, V>(
  pairs: readonly (readonly [K, V])[]
): Record<K, V> {
  const result = {} as Record<K, V>
  for (const [key, value] of pairs) {
    result[key] = value
  }
  return result
}
