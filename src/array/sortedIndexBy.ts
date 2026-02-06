/**
 * Like sortedIndex, but accepts an iteratee.
 *
 * @example
 * sortedIndexBy([{ x: 4 }, { x: 5 }], { x: 4 }, o => o.x)
 * // 0
 */
export function sortedIndexBy<T>(
  array: readonly T[],
  value: T,
  iteratee: (value: T) => unknown
): number {
  const computedValue = iteratee(value)
  let low = 0
  let high = array.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if ((iteratee(array[mid]!) as number) < (computedValue as number)) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return low
}
