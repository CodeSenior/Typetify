/**
 * Returns the size of a collection (array, object, string, Map, or Set).
 *
 * @example
 * // Array length
 * size([1, 2, 3])
 * // => 3
 *
 * @example
 * // Object keys count
 * size({ a: 1, b: 2, c: 3 })
 * // => 3
 *
 * @example
 * // String length
 * size('hello')
 * // => 5
 *
 * @example
 * // Map size
 * size(new Map([['a', 1], ['b', 2]]))
 * // => 2
 *
 * @example
 * // Set size
 * size(new Set([1, 2, 3]))
 * // => 3
 *
 * @example
 * // Null/undefined returns 0
 * size(null)
 * // => 0
 */
export function size(
  collection: readonly unknown[] | Record<PropertyKey, unknown> | string | Map<unknown, unknown> | Set<unknown> | null | undefined
): number {
  if (collection == null) {
    return 0
  }

  if (typeof collection === 'string') {
    return collection.length
  }

  if (Array.isArray(collection)) {
    return collection.length
  }

  if (collection instanceof Map || collection instanceof Set) {
    return collection.size
  }

  return Object.keys(collection).length
}
