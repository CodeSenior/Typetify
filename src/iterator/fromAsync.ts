/**
 * Creates an async iterator from an async iterable or async generator.
 *
 * @example
 * const iter = fromAsync(async function* () {
 *   yield 1
 *   yield 2
 *   yield 3
 * })
 * for await (const value of iter) {
 *   console.log(value)
 * }
 */
export function fromAsync<T>(
  source: AsyncIterable<T> | (() => AsyncGenerator<T>)
): AsyncLazyIterator<T> {
  const getIterator = (): AsyncIterator<T> => {
    if (typeof source === 'function') {
      return source()
    }
    return source[Symbol.asyncIterator]()
  }

  return {
    [Symbol.asyncIterator](): AsyncIterator<T> {
      return getIterator()
    },

    map<U>(fn: (value: T, index: number) => U | Promise<U>): AsyncLazyIterator<U> {
      const self = this
      return fromAsync(async function* () {
        let index = 0
        for await (const value of self) {
          yield await fn(value, index++)
        }
      })
    },

    filter(predicate: (value: T) => boolean | Promise<boolean>): AsyncLazyIterator<T> {
      const self = this
      return fromAsync(async function* () {
        for await (const value of self) {
          if (await predicate(value)) {
            yield value
          }
        }
      })
    },

    take(n: number): AsyncLazyIterator<T> {
      const self = this
      return fromAsync(async function* () {
        let count = 0
        for await (const value of self) {
          if (count >= n) break
          yield value
          count++
        }
      })
    },

    skip(n: number): AsyncLazyIterator<T> {
      const self = this
      return fromAsync(async function* () {
        let count = 0
        for await (const value of self) {
          if (count >= n) {
            yield value
          }
          count++
        }
      })
    },

    async toArray(): Promise<T[]> {
      const result: T[] = []
      for await (const value of this) {
        result.push(value)
      }
      return result
    },

    async reduce<U>(fn: (acc: U, value: T) => U | Promise<U>, initial: U): Promise<U> {
      let acc = initial
      for await (const value of this) {
        acc = await fn(acc, value)
      }
      return acc
    },

    async forEach(fn: (value: T, index: number) => void | Promise<void>): Promise<void> {
      let index = 0
      for await (const value of this) {
        await fn(value, index++)
      }
    },

    async find(predicate: (value: T) => boolean | Promise<boolean>): Promise<T | undefined> {
      for await (const value of this) {
        if (await predicate(value)) return value
      }
      return undefined
    },

    async first(): Promise<T | undefined> {
      for await (const value of this) {
        return value
      }
      return undefined
    },

    async count(): Promise<number> {
      let count = 0
      for await (const _ of this) {
        count++
      }
      return count
    },
  }
}

export interface AsyncLazyIterator<T> extends AsyncIterable<T> {
  map<U>(fn: (value: T, index: number) => U | Promise<U>): AsyncLazyIterator<U>
  filter(predicate: (value: T) => boolean | Promise<boolean>): AsyncLazyIterator<T>
  take(n: number): AsyncLazyIterator<T>
  skip(n: number): AsyncLazyIterator<T>
  toArray(): Promise<T[]>
  reduce<U>(fn: (acc: U, value: T) => U | Promise<U>, initial: U): Promise<U>
  forEach(fn: (value: T, index: number) => void | Promise<void>): Promise<void>
  find(predicate: (value: T) => boolean | Promise<boolean>): Promise<T | undefined>
  first(): Promise<T | undefined>
  count(): Promise<number>
}
