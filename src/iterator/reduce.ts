/**
 * Reduces an iterable to a single value.
 *
 * @example
 * reduce([1, 2, 3, 4], (acc, val) => acc + val, 0) // 10
 */
export function reduce<T, U>(
  source: Iterable<T>,
  fn: (acc: U, value: T) => U,
  initial: U
): U {
  let acc = initial
  for (const value of source) {
    acc = fn(acc, value)
  }
  return acc
}
