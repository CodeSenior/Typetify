import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates a lazy iterator that zips two iterables together.
 *
 * @example
 * zip([1, 2, 3], ['a', 'b', 'c']).toArray() // [[1, 'a'], [2, 'b'], [3, 'c']]
 */
export function zip<T, U>(
  source1: Iterable<T>,
  source2: Iterable<U>
): LazyIterator<[T, U]> {
  return createIterator(function* () {
    const iter1 = source1[Symbol.iterator]()
    const iter2 = source2[Symbol.iterator]()
    while (true) {
      const r1 = iter1.next()
      const r2 = iter2.next()
      if (r1.done || r2.done) break
      yield [r1.value, r2.value] as [T, U]
    }
  })
}
