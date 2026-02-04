/**
 * Returns all but the first n elements of an array.
 *
 * @example
 * drop([1, 2, 3, 4, 5], 2) // [3, 4, 5]
 * drop([1, 2], 5) // []
 */
export function drop<T>(arr: readonly T[], n: number): T[] {
  if (n <= 0) return [...arr]
  return arr.slice(n)
}
