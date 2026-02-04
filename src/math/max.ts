/**
 * Returns the maximum value in an array.
 *
 * @example
 * max([3, 1, 4, 1, 5]) // 5
 * max([]) // undefined
 */
export function max(numbers: readonly number[]): number | undefined {
  if (numbers.length === 0) return undefined
  let result = numbers[0]!
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i]! > result) {
      result = numbers[i]!
    }
  }
  return result
}
