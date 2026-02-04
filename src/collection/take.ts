/**
 * Returns the first n elements of an array.
 *
 * @example
 * take([1, 2, 3, 4, 5], 3) // [1, 2, 3]
 * take([1, 2], 5) // [1, 2]
 */
export function take<T>(arr: readonly T[], n: number): T[] {
  if (n <= 0) return []
  return arr.slice(0, n)
}
