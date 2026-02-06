/**
 * Like sortedIndex, but returns the highest index.
 *
 * @example
 * sortedLastIndex([4, 5, 5, 5, 6], 5)
 * // 4
 */
export function sortedLastIndex<T>(array: readonly T[], value: T): number {
  let low = 0
  let high = array.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (array[mid]! <= value) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return low
}
