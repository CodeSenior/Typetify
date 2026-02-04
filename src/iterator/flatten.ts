import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates a lazy iterator that flattens nested iterables.
 *
 * @example
 * flatten([[1, 2], [3, 4]]).toArray() // [1, 2, 3, 4]
 */
export function flatten<T>(source: Iterable<Iterable<T>>): LazyIterator<T> {
  return createIterator(function* () {
    for (const inner of source) {
      yield* inner
    }
  })
}
