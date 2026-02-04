import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates an infinite iterator that cycles through the source.
 * WARNING: This creates an infinite iterator. Use with take() or similar.
 *
 * @example
 * cycle([1, 2, 3]).take(7).toArray() // [1, 2, 3, 1, 2, 3, 1]
 */
export function cycle<T>(source: Iterable<T>): LazyIterator<T> {
  return createIterator(function* () {
    const cached: T[] = []
    for (const value of source) {
      cached.push(value)
      yield value
    }
    if (cached.length === 0) return
    while (true) {
      for (const value of cached) {
        yield value
      }
    }
  })
}
