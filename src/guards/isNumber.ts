/**
 * Checks if a value is a number (excludes NaN).
 *
 * @example
 * isNumber(42) // true
 * isNumber(NaN) // false
 * isNumber('42') // false
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}
