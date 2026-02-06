/**
 * Checks if value is a safe integer.
 *
 * @example
 * isSafeInteger(3) // true
 * isSafeInteger(Number.MAX_SAFE_INTEGER) // true
 * isSafeInteger(Infinity) // false
 * isSafeInteger('3') // false
 */
export function isSafeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value)
}
