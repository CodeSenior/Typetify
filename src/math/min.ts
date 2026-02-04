/**
 * Returns the minimum value in an array.
 *
 * @example
 * min([3, 1, 4, 1, 5]) // 1
 * min([]) // undefined
 */
export function min(numbers: readonly number[]): number | undefined {
  if (numbers.length === 0) return undefined
  let result = numbers[0]!
  for (let i = 1; i < numbers.length; i++) {
    if (numbers[i]! < result) {
      result = numbers[i]!
    }
  }
  return result
}
