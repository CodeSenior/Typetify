/**
 * Uses binary search to determine the lowest index to insert value.
 *
 * @example
 * sortedIndex([30, 50], 40)
 * // 1
 */
export function sortedIndex<T>(array: readonly T[], value: T): number {
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

  return low
}
