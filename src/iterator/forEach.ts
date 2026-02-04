/**
 * Iterates over an iterable and calls a function for each element.
 *
 * @example
 * forEach([1, 2, 3], console.log)
 */
export function forEach<T>(
  source: Iterable<T>,
  fn: (value: T, index: number) => void
): void {
  let index = 0
  for (const value of source) {
    fn(value, index++)
  }
}
