/**
 * Performs a binary search on a sorted array to find value.
 *
 * @example
 * sortedIndexOf([4, 5, 5, 5, 6], 5)
 * // 1
 */
export function sortedIndexOf<T>(array: readonly T[], value: T): number {
  let low = 0
  let high = array.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if (array[mid]! < value) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return low < array.length && array[low] === value ? low : -1
}
