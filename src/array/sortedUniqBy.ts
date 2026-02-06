/**
 * Like sortedUniq, but accepts an iteratee.
 *
 * @example
 * sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor)
 * // [1.1, 2.3]
 */
export function sortedUniqBy<T>(
  array: readonly T[],
  iteratee: (value: T) => unknown
): T[] {
  if (array.length === 0) return []

  const result: T[] = [array[0]!]
  let lastComputed = iteratee(array[0]!)

  for (let i = 1; i < array.length; i++) {
    const computed = iteratee(array[i]!)
    if (computed !== lastComputed) {
      result.push(array[i]!)
      lastComputed = computed
    }
  }

  return result
}
