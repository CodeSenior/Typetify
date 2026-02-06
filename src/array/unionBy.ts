/**
 * Like union, but accepts an iteratee to compare by.
 *
 * @example
 * unionBy([2.1], [1.2, 2.3], Math.floor)
 * // [2.1, 1.2]
 */
export function unionBy<T>(
  iteratee: (value: T) => unknown,
  ...arrays: readonly (readonly T[])[]
): T[] {
  const seen = new Set<unknown>()
  const result: T[] = []

  for (const array of arrays) {
    for (const item of array) {
      const computed = iteratee(item)
      if (!seen.has(computed)) {
        seen.add(computed)
        result.push(item)
      }
    }
  }

  return result
}
