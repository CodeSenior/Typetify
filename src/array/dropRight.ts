/**
 * Creates a slice of array with n elements dropped from the end.
 *
 * @example
 * dropRight([1, 2, 3]) // [1, 2]
 * dropRight([1, 2, 3], 2) // [1]
 */
export function dropRight<T>(array: readonly T[], n: number = 1): T[] {
  if (n <= 0) return [...array]
  if (n >= array.length) return []
  return array.slice(0, -n)
}
