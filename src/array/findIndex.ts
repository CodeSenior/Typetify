/**
 * Returns the index of the first element predicate returns truthy for.
 *
 * @example
 * findIndex([1, 2, 3, 4], n => n > 2)
 * // 2
 */
export function findIndex<T>(
  array: readonly T[],
  predicate: (value: T) => boolean
): number {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i]!)) {
      return i
    }
  }
  return -1
}
