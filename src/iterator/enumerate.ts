import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates a lazy iterator that yields [index, value] pairs.
 *
 * @example
 * enumerate(['a', 'b', 'c']).toArray() // [[0, 'a'], [1, 'b'], [2, 'c']]
 */
export function enumerate<T>(source: Iterable<T>): LazyIterator<[number, T]> {
  return createIterator(function* () {
    let index = 0
    for (const value of source) {
      yield [index++, value] as [number, T]
    }
  })
}
