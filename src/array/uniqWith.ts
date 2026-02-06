/**
 * Like unique, but accepts a comparator function.
 *
 * @example
 * const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }, { x: 1, y: 2 }]
 * uniqWith(objects, isEqual)
 * // [{ x: 1, y: 2 }, { x: 2, y: 1 }]
 */
export function uniqWith<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  const result: T[] = []

  for (const item of array) {
    const exists = result.some((existing) => comparator(existing, item))
    if (!exists) {
      result.push(item)
    }
  }

  return result
}
