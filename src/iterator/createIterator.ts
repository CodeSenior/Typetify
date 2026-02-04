/**
 * Creates a lazy iterator with chainable operations.
 * Operations are only executed when the iterator is consumed.
 *
 * @example
 * const result = createIterator([1, 2, 3, 4, 5])
 *   .map(x => x * 2)
 *   .filter(x => x > 4)
 *   .take(2)
 *   .toArray()
 * // [6, 8]
 */
export function createIterator<T>(
  source: Iterable<T> | (() => Generator<T>)
): LazyIterator<T> {
  const getIterator = (): Iterator<T> => {
    if (typeof source === 'function') {
      return source()
    }
    return source[Symbol.iterator]()
  }

  return {
    [Symbol.iterator](): Iterator<T> {
      return getIterator()
    },

    map<U>(fn: (value: T, index: number) => U): LazyIterator<U> {
      const self = this
      return createIterator(function* () {
        let index = 0
        for (const value of self) {
          yield fn(value, index++)
        }
      })
    },

    filter(predicate: (value: T, index: number) => boolean): LazyIterator<T> {
      const self = this
      return createIterator(function* () {
        let index = 0
        for (const value of self) {
          if (predicate(value, index++)) {
            yield value
          }
        }
      })
    },

    take(n: number): LazyIterator<T> {
      const self = this
      return createIterator(function* () {
        let count = 0
        for (const value of self) {
          if (count >= n) break
          yield value
          count++
        }
      })
    },

    skip(n: number): LazyIterator<T> {
      const self = this
      return createIterator(function* () {
        let count = 0
        for (const value of self) {
          if (count >= n) {
            yield value
          }
          count++
        }
      })
    },

    takeWhile(predicate: (value: T) => boolean): LazyIterator<T> {
      const self = this
      return createIterator(function* () {
        for (const value of self) {
          if (!predicate(value)) break
          yield value
        }
      })
    },

    skipWhile(predicate: (value: T) => boolean): LazyIterator<T> {
      const self = this
      return createIterator(function* () {
        let skipping = true
        for (const value of self) {
          if (skipping && predicate(value)) continue
          skipping = false
          yield value
        }
      })
    },

    flatMap<U>(fn: (value: T) => Iterable<U>): LazyIterator<U> {
      const self = this
      return createIterator(function* () {
        for (const value of self) {
          yield* fn(value)
        }
      })
    },

    flatten<U>(this: LazyIterator<Iterable<U>>): LazyIterator<U> {
      const self = this
      return createIterator(function* () {
        for (const value of self) {
          yield* value
        }
      })
    },

    chunk(size: number): LazyIterator<T[]> {
      const self = this
      return createIterator(function* () {
        let chunk: T[] = []
        for (const value of self) {
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
    },

    enumerate(): LazyIterator<[number, T]> {
      const self = this
      return createIterator(function* () {
        let index = 0
        for (const value of self) {
          yield [index++, value] as [number, T]
        }
      })
    },

    zip<U>(other: Iterable<U>): LazyIterator<[T, U]> {
      const self = this
      return createIterator(function* () {
        const iter1 = self[Symbol.iterator]()
        const iter2 = other[Symbol.iterator]()
        while (true) {
          const r1 = iter1.next()
          const r2 = iter2.next()
          if (r1.done || r2.done) break
          yield [r1.value, r2.value] as [T, U]
        }
      })
    },

    concat(...others: Iterable<T>[]): LazyIterator<T> {
      const self = this
      return createIterator(function* () {
        yield* self
        for (const other of others) {
          yield* other
        }
      })
    },

    unique(keyFn?: (value: T) => unknown): LazyIterator<T> {
      const self = this
      return createIterator(function* () {
        const seen = new Set<unknown>()
        for (const value of self) {
          const key = keyFn ? keyFn(value) : value
          if (!seen.has(key)) {
            seen.add(key)
            yield value
          }
        }
      })
    },

    toArray(): T[] {
      return [...this]
    },

    reduce<U>(fn: (acc: U, value: T) => U, initial: U): U {
      let acc = initial
      for (const value of this) {
        acc = fn(acc, value)
      }
      return acc
    },

    forEach(fn: (value: T, index: number) => void): void {
      let index = 0
      for (const value of this) {
        fn(value, index++)
      }
    },

    find(predicate: (value: T) => boolean): T | undefined {
      for (const value of this) {
        if (predicate(value)) return value
      }
      return undefined
    },

    some(predicate: (value: T) => boolean): boolean {
      for (const value of this) {
        if (predicate(value)) return true
      }
      return false
    },

    every(predicate: (value: T) => boolean): boolean {
      for (const value of this) {
        if (!predicate(value)) return false
      }
      return true
    },

    first(): T | undefined {
      for (const value of this) {
        return value
      }
      return undefined
    },

    last(): T | undefined {
      let last: T | undefined
      for (const value of this) {
        last = value
      }
      return last
    },

    count(): number {
      let count = 0
      for (const _ of this) {
        count++
      }
      return count
    },

    collect<U>(collector: (iterator: LazyIterator<T>) => U): U {
      return collector(this)
    },
  }
}

export interface LazyIterator<T> extends Iterable<T> {
  map<U>(fn: (value: T, index: number) => U): LazyIterator<U>
  filter(predicate: (value: T, index: number) => boolean): LazyIterator<T>
  take(n: number): LazyIterator<T>
  skip(n: number): LazyIterator<T>
  takeWhile(predicate: (value: T) => boolean): LazyIterator<T>
  skipWhile(predicate: (value: T) => boolean): LazyIterator<T>
  flatMap<U>(fn: (value: T) => Iterable<U>): LazyIterator<U>
  flatten<U>(this: LazyIterator<Iterable<U>>): LazyIterator<U>
  chunk(size: number): LazyIterator<T[]>
  enumerate(): LazyIterator<[number, T]>
  zip<U>(other: Iterable<U>): LazyIterator<[T, U]>
  concat(...others: Iterable<T>[]): LazyIterator<T>
  unique(keyFn?: (value: T) => unknown): LazyIterator<T>
  toArray(): T[]
  reduce<U>(fn: (acc: U, value: T) => U, initial: U): U
  forEach(fn: (value: T, index: number) => void): void
  find(predicate: (value: T) => boolean): T | undefined
  some(predicate: (value: T) => boolean): boolean
  every(predicate: (value: T) => boolean): boolean
  first(): T | undefined
  last(): T | undefined
  count(): number
  collect<U>(collector: (iterator: LazyIterator<T>) => U): U
}
