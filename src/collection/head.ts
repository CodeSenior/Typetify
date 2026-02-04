/**
 * Returns the first element of an array, or undefined if empty.
 * Alias for first().
 *
 * @example
 * head([1, 2, 3]) // 1
 * head([]) // undefined
 */
export function head<T>(arr: readonly T[]): T | undefined {
  return arr[0]
}
