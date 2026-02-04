/**
 * Returns the median of all numbers in an array.
 *
 * @example
 * median([1, 2, 3, 4, 5]) // 3
 * median([1, 2, 3, 4]) // 2.5
 * median([]) // NaN
 */
export function median(numbers: readonly number[]): number {
  if (numbers.length === 0) return NaN

  const sorted = [...numbers].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)

  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1]! + sorted[mid]!) / 2
  }

  return sorted[mid]!
}
