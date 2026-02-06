/**
 * Like intersection, but accepts an iteratee to compare by.
 *
 * @example
 * intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor)
 * // [2.1]
 */
export function intersectionBy<T>(
  array: readonly T[],
  values: readonly T[],
  iteratee: (value: T) => unknown
): T[] {
  const valuesSet = new Set(values.map(iteratee))
  return array.filter((item) => valuesSet.has(iteratee(item)))
}
