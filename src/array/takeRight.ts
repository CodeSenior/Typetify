/**
 * Creates a slice of array with n elements taken from the end.
 *
 * @example
 * takeRight([1, 2, 3]) // [3]
 * takeRight([1, 2, 3], 2) // [2, 3]
 */
export function takeRight<T>(array: readonly T[], n: number = 1): T[] {
  if (n <= 0) return []
  if (n >= array.length) return [...array]
  return array.slice(-n)
}
