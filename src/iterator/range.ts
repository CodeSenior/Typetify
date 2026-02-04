import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates a lazy range iterator.
 *
 * @example
 * range(0, 10).toArray() // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 * range(0, 10, 2).toArray() // [0, 2, 4, 6, 8]
 * range(10, 0, -1).toArray() // [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
 */
export function range(
  start: number,
  end: number,
  step: number = 1
): LazyIterator<number> {
  return createIterator(function* () {
    if (step > 0) {
      for (let i = start; i < end; i += step) {
        yield i
      }
    } else if (step < 0) {
      for (let i = start; i > end; i += step) {
        yield i
      }
    }
  })
}
