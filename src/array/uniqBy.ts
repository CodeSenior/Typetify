/**
 * Like unique, but accepts an iteratee to compare by.
 *
 * @example
 * uniqBy([2.1, 1.2, 2.3], Math.floor)
 * // [2.1, 1.2]
 */
export function uniqBy<T>(
  array: readonly T[],
  iteratee: (value: T) => unknown
): T[] {
  const seen = new Set<unknown>()
  const result: T[] = []

  for (const item of array) {
    const computed = iteratee(item)
    if (!seen.has(computed)) {
      seen.add(computed)
      result.push(item)
    }
  }

  return result
}
