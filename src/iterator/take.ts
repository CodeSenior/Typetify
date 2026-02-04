import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates a lazy iterator that takes the first n elements.
 *
 * @example
 * take([1, 2, 3, 4, 5], 3).toArray() // [1, 2, 3]
 */
export function take<T>(source: Iterable<T>, n: number): LazyIterator<T> {
  return createIterator(function* () {
    let count = 0
    for (const value of source) {
      if (count >= n) break
      yield value
      count++
    }
  })
}
