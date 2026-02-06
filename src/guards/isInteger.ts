/**
 * Checks if value is an integer.
 *
 * @example
 * isInteger(3) // true
 * isInteger(3.0) // true
 * isInteger(3.5) // false
 * isInteger('3') // false
 */
export function isInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value)
}
