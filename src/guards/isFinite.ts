/**
 * Checks if value is a finite number.
 *
 * @example
 * isFinite(3) // true
 * isFinite(Infinity) // false
 * isFinite('3') // false
 * isFinite(NaN) // false
 */
export function isFinite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}
