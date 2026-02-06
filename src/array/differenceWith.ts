/**
 * Like difference, but accepts a comparator function.
 *
 * @example
 * const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }]
 * differenceWith(objects, [{ x: 1, y: 2 }], isEqual)
 * // [{ x: 2, y: 1 }]
 */
export function differenceWith<T>(
  array: readonly T[],
  values: readonly T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  return array.filter(
    (item) => !values.some((value) => comparator(item, value))
  )
}
