import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates a lazy iterator that skips the first n elements.
 *
 * @example
 * skip([1, 2, 3, 4, 5], 2).toArray() // [3, 4, 5]
 */
export function skip<T>(source: Iterable<T>, n: number): LazyIterator<T> {
  return createIterator(function* () {
    let count = 0
    for (const value of source) {
      if (count >= n) {
        yield value
      }
      count++
    }
  })
}
