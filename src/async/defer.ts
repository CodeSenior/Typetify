export interface Deferred<T> {
  promise: Promise<T>
  resolve: (value: T | PromiseLike<T>) => void
  reject: (reason?: unknown) => void
}

/**
 * Creates a deferred promise that can be resolved or rejected externally.
 *
 * @example
 * const deferred = defer<string>()
 *
 * setTimeout(() => {
 *   deferred.resolve('Done!')
 * }, 1000)
 *
 * const result = await deferred.promise
 */
export function defer<T>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}
