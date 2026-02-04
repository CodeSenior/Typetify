/**
 * Creates a type-safe Map with inferred key and value types.
 *
 * @example
 * const userMap = createMap<number, { name: string }>()
 * userMap.set(1, { name: 'John' })
 * const user = userMap.get(1) // { name: string } | undefined
 */
export function createMap<K, V>(
  entries?: readonly (readonly [K, V])[]
): Map<K, V> {
  return new Map(entries)
}
