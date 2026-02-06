/**
 * Creates an object from arrays of keys and values.
 *
 * @example
 * zipObject(['a', 'b'], [1, 2])
 * // { a: 1, b: 2 }
 */
export function zipObject<K extends PropertyKey, V>(
  keys: readonly K[],
  values: readonly V[]
): Record<K, V> {
  const result = {} as Record<K, V>
  const length = Math.min(keys.length, values.length)

  for (let i = 0; i < length; i++) {
    result[keys[i]!] = values[i]!
  }

  return result
}
