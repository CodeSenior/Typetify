/**
 * Checks if a value is an Error instance.
 *
 * @example
 * isError(new Error('oops')) // true
 * isError(new TypeError('bad')) // true
 * isError({ message: 'fake' }) // false
 */
export function isError(value: unknown): value is Error {
  return value instanceof Error
}
