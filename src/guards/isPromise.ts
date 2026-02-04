/**
 * Checks if a value is a Promise or Promise-like object.
 *
 * @example
 * isPromise(Promise.resolve()) // true
 * isPromise({ then: () => {} }) // true
 * isPromise({}) // false
 */
export function isPromise<T = unknown>(value: unknown): value is Promise<T> {
  return (
    value instanceof Promise ||
    (value !== null &&
      typeof value === 'object' &&
      'then' in value &&
      typeof (value as Record<string, unknown>).then === 'function')
  )
}
