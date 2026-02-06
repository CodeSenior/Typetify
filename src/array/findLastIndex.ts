/**
 * Like findIndex but iterates from right to left.
 *
 * @example
 * findLastIndex([1, 2, 3, 4], n => n > 2)
 * // 3
 */
export function findLastIndex<T>(
  array: readonly T[],
  predicate: (value: T) => boolean
): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i]!)) {
      return i
    }
  }
  return -1
}
