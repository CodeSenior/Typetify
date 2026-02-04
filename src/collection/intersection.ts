/**
 * Returns elements that exist in both arrays.
 *
 * @example
 * intersection([1, 2, 3], [2, 3, 4])
 * // [2, 3]
 */
export function intersection<T>(a: readonly T[], b: readonly T[]): T[] {
  const setB = new Set(b)
  return a.filter((item) => setB.has(item))
}
