/**
 * Like sortedLastIndex, but accepts an iteratee.
 *
 * @example
 * sortedLastIndexBy([{ x: 4 }, { x: 5 }], { x: 4 }, o => o.x)
 * // 1
 */
export function sortedLastIndexBy<T>(
  array: readonly T[],
  value: T,
  iteratee: (value: T) => unknown
): number {
  const computedValue = iteratee(value)
  let low = 0
  let high = array.length

  while (low < high) {
    const mid = Math.floor((low + high) / 2)
    if ((iteratee(array[mid]!) as number) <= (computedValue as number)) {
      low = mid + 1
    } else {
      high = mid
    }
  }

  return low
}
