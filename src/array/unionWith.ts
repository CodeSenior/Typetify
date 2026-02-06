/**
 * Like union, but accepts a comparator function.
 *
 * @example
 * const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }]
 * const others = [{ x: 1, y: 1 }, { x: 1, y: 2 }]
 * unionWith(isEqual, objects, others)
 * // [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 1, y: 1 }]
 */
export function unionWith<T>(
  comparator: (a: T, b: T) => boolean,
  ...arrays: readonly (readonly T[])[]
): T[] {
  const result: T[] = []

  for (const array of arrays) {
    for (const item of array) {
      const exists = result.some((existing) => comparator(existing, item))
      if (!exists) {
        result.push(item)
      }
    }
  }

  return result
}
