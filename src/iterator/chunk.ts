import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates a lazy iterator that chunks elements.
 *
 * @example
 * chunk([1, 2, 3, 4, 5], 2).toArray() // [[1, 2], [3, 4], [5]]
 */
export function chunk<T>(source: Iterable<T>, size: number): LazyIterator<T[]> {
  return createIterator(function* () {
    let chunk: T[] = []
    for (const value of source) {
      chunk.push(value)
      if (chunk.length === size) {
        yield chunk
        chunk = []
      }
    }
    if (chunk.length > 0) {
      yield chunk
    }
  })
}
