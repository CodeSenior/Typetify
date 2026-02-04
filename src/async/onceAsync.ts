/**
 * Creates an async function that can only be called once.
 * Subsequent calls return the same promise.
 * Useful for initialization that should only happen once.
 *
 * @example
 * const loadConfig = onceAsync(async () => {
 *   const response = await fetch('/config')
 *   return response.json()
 * })
 *
 * // Both calls return the same promise
 * const config1 = await loadConfig()
 * const config2 = await loadConfig()
 */
export function onceAsync<T>(fn: () => Promise<T>): () => Promise<T> {
  let promise: Promise<T> | undefined

  return (): Promise<T> => {
    if (promise === undefined) {
      promise = fn()
    }
    return promise
  }
}
