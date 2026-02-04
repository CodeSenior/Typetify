import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates a lazy map iterator.
 *
 * @example
 * map([1, 2, 3], x => x * 2).toArray() // [2, 4, 6]
 */
export function map<T, U>(
  source: Iterable<T>,
  fn: (value: T, index: number) => U
): LazyIterator<U> {
  return createIterator(function* () {
    let index = 0
    for (const value of source) {
      yield fn(value, index++)
    }
  })
}
