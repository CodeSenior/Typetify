/**
 * Returns the sum of all numbers in an array.
 *
 * @example
 * sum([1, 2, 3, 4, 5]) // 15
 * sum([]) // 0
 */
export function sum(numbers: readonly number[]): number {
  let total = 0
  for (const n of numbers) {
    total += n
  }
  return total
}
