/**
 * Returns N random elements from an array.
 * Uses Fisher-Yates shuffle for unbiased selection.
 *
 * @example
 * // Get 2 random elements
 * sampleSize([1, 2, 3, 4, 5], 2)
 * // => [3, 1] (random selection)
 *
 * @example
 * // Request more than available returns all (shuffled)
 * sampleSize([1, 2, 3], 10)
 * // => [2, 3, 1] (all elements, shuffled)
 *
 * @example
 * // Get random winners from participants
 * const participants = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve']
 * sampleSize(participants, 3)
 * // => ['Diana', 'Alice', 'Eve'] (3 random winners)
 *
 * @example
 * // Empty array or n <= 0 returns empty array
 * sampleSize([], 5)
 * // => []
 * sampleSize([1, 2, 3], 0)
 * // => []
 */
export function sampleSize<T>(array: readonly T[], n: number): T[] {
  if (n <= 0 || array.length === 0) {
    return []
  }

  const size = Math.min(n, array.length)
  const result = [...array]

  for (let i = 0; i < size; i++) {
    const j = i + Math.floor(Math.random() * (result.length - i))
    const temp = result[i]
    result[i] = result[j]!
    result[j] = temp!
  }

  return result.slice(0, size)
}
