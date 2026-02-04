/**
 * Sums the values returned by the function for each element.
 *
 * @example
 * sumBy([{ price: 10 }, { price: 20 }, { price: 30 }], item => item.price)
 * // 60
 *
 * sumBy([], item => item.price) // 0
 */
export function sumBy<T>(
  arr: readonly T[],
  fn: (item: T) => number
): number {
  let sum = 0
  for (const item of arr) {
    sum += fn(item)
  }
  return sum
}
