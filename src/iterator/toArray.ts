/**
 * Converts an iterable to an array.
 *
 * @example
 * toArray(new Set([1, 2, 3])) // [1, 2, 3]
 */
export function toArray<T>(source: Iterable<T>): T[] {
  return [...source]
}
