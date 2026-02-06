/**
 * Like intersection, but accepts a comparator function.
 *
 * @example
 * const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }]
 * intersectionWith(objects, [{ x: 1, y: 2 }], isEqual)
 * // [{ x: 1, y: 2 }]
 */
export function intersectionWith<T>(
  array: readonly T[],
  values: readonly T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  return array.filter((item) =>
    values.some((value) => comparator(item, value))
  )
}
