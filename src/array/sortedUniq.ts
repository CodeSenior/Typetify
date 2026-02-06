/**
 * Returns a duplicate-free version of a sorted array.
 *
 * @example
 * sortedUniq([1, 1, 2])
 * // [1, 2]
 */
export function sortedUniq<T>(array: readonly T[]): T[] {
  if (array.length === 0) return []

  const result: T[] = [array[0]!]

  for (let i = 1; i < array.length; i++) {
    if (array[i] !== array[i - 1]) {
      result.push(array[i]!)
    }
  }

  return result
}
