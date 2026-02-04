/**
 * Checks if a value is a boolean.
 *
 * @example
 * isBoolean(true) // true
 * isBoolean(1) // false
 */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean'
}
