/**
 * Checks if a value is a function.
 *
 * @example
 * isFunction(() => {}) // true
 * isFunction(console.log) // true
 */
export function isFunction(value: unknown): value is (...args: unknown[]) => unknown {
  return typeof value === 'function'
}
