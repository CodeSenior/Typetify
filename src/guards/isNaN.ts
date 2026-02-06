/**
 * Checks if value is NaN.
 *
 * @example
 * isNaN(NaN) // true
 * isNaN(undefined) // false
 * isNaN('NaN') // false
 */
export function isNaN(value: unknown): boolean {
  return typeof value === 'number' && Number.isNaN(value)
}
