/**
 * Checks if value is a valid array-like length.
 *
 * @example
 * isLength(3) // true
 * isLength(0) // true
 * isLength(-1) // false
 * isLength(Infinity) // false
 * isLength(Number.MAX_SAFE_INTEGER) // true
 */
export function isLength(value: unknown): value is number {
  return (
    typeof value === 'number' &&
    value >= 0 &&
    value <= Number.MAX_SAFE_INTEGER &&
    Number.isInteger(value)
  )
}
