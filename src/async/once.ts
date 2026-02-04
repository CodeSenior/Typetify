/**
 * Creates a function that can only be called once.
 * Subsequent calls return the result of the first call.
 *
 * @example
 * const initialize = once(() => {
 *   console.log('Initializing...')
 *   return { ready: true }
 * })
 *
 * initialize() // logs 'Initializing...', returns { ready: true }
 * initialize() // returns { ready: true } without logging
 */
export function once<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T
): T {
  let called = false
  let result: ReturnType<T>

  return ((...args: Parameters<T>): ReturnType<T> => {
    if (!called) {
      called = true
      result = fn(...args)
    }
    return result
  }) as T
}
