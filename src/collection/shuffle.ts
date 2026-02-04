/**
 * Returns a new array with elements randomly shuffled.
 * Uses Fisher-Yates algorithm.
 *
 * @example
 * shuffle([1, 2, 3, 4, 5])
 * // [3, 1, 5, 2, 4] (random order)
 */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = [...array]

  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = result[i]
    result[i] = result[j]!
    result[j] = temp!
  }

  return result
}
