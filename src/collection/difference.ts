/**
 * Returns elements in the first array that are not in the second.
 *
 * @example
 * difference([1, 2, 3, 4], [2, 4])
 * // [1, 3]
 */
export function difference<T>(a: readonly T[], b: readonly T[]): T[] {
  const setB = new Set(b)
  return a.filter((item) => !setB.has(item))
}
