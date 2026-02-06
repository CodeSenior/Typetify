/**
 * Like sortedIndexOf, but returns the highest index.
 *
 * @example
 * sortedLastIndexOf([4, 5, 5, 5, 6], 5)
 * // 3
 */
export function sortedLastIndexOf<T>(array: readonly T[], value: T): number {
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

  return low > 0 && array[low - 1] === value ? low - 1 : -1
}
