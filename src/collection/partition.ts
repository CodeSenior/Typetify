/**
 * Splits an array into two arrays based on a predicate.
 * First array contains items that pass, second contains items that fail.
 *
 * @example
 * const [evens, odds] = partition([1, 2, 3, 4], n => n % 2 === 0)
 * // evens: [2, 4], odds: [1, 3]
 */
export function partition<T>(
  array: readonly T[],
  predicate: (item: T) => boolean
): [T[], T[]] {
  const pass: T[] = []
  const fail: T[] = []

  for (const item of array) {
    if (predicate(item)) {
      pass.push(item)
    } else {
      fail.push(item)
    }
  }

  return [pass, fail]
}
