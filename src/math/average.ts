/**
 * Returns the average (mean) of all numbers in an array.
 *
 * @example
 * average([1, 2, 3, 4, 5]) // 3
 * average([10, 20]) // 15
 * average([]) // NaN
 */
export function average(numbers: readonly number[]): number {
  if (numbers.length === 0) return NaN
  let total = 0
  for (const n of numbers) {
    total += n
  }
  return total / numbers.length
}
