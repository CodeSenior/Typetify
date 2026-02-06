/**
 * Like difference, but accepts an iteratee to compare by.
 *
 * @example
 * differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor)
 * // [1.2]
 */
export function differenceBy<T>(
  array: readonly T[],
  values: readonly T[],
  iteratee: (value: T) => unknown
): T[] {
  const valuesSet = new Set(values.map(iteratee))
  return array.filter((item) => !valuesSet.has(iteratee(item)))
}
