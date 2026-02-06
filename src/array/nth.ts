/**
 * Gets the element at index n of array. Negative indices count from the end.
 *
 * @example
 * nth(['a', 'b', 'c', 'd'], 1) // 'b'
 * nth(['a', 'b', 'c', 'd'], -2) // 'c'
 */
export function nth<T>(array: readonly T[], n: number = 0): T | undefined {
  const index = n < 0 ? array.length + n : n
  return array[index]
}
