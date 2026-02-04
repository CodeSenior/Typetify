import { createIterator, type LazyIterator } from './createIterator.js'

/**
 * Creates an iterator that repeats a value n times (or infinitely if n is not provided).
 *
 * @example
 * repeat('x', 3).toArray() // ['x', 'x', 'x']
 * repeat(0).take(5).toArray() // [0, 0, 0, 0, 0]
 */
export function repeat<T>(value: T, n?: number): LazyIterator<T> {
  return createIterator(function* () {
    if (n === undefined) {
      while (true) {
        yield value
      }
    } else {
      for (let i = 0; i < n; i++) {
        yield value
      }
    }
  })
}
