import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates a lazy filter iterator.
 *
 * @example
 * filter([1, 2, 3, 4], x => x % 2 === 0).toArray() // [2, 4]
 */
export function filter<T>(
  source: Iterable<T>,
  predicate: (value: T, index: number) => boolean
): LazyIterator<T> {
  return createIterator(function* () {
    let index = 0
    for (const value of source) {
      if (predicate(value, index++)) {
        yield value
      }
    }
  })
}
