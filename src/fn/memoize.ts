/**
 * Creates a memoized version of a function.
 * Results are cached based on the first argument (by default).
 *
 * @example
 * const expensive = memoize((n: number) => {
 *   console.log('computing...')
 *   return n * 2
 * })
 * expensive(5) // logs 'computing...', returns 10
 * expensive(5) // returns 10 (cached)
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  resolver?: (...args: Parameters<T>) => unknown
): T {
  const cache = new Map<unknown, ReturnType<T>>()

  const memoized = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : args[0]

    if (cache.has(key)) {
      return cache.get(key)!
    }

    const result = fn.apply(this, args)
    cache.set(key, result)
    return result
  }

  return memoized as T
}
