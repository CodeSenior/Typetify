/**
 * Checks if a value is a string.
 *
 * @example
 * if (isString(value)) {
 *   console.log(value.toUpperCase())
 * }
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
