/**
 * Checks if value is null.
 *
 * @example
 * isNull(null) // true
 * isNull(undefined) // false
 * isNull(0) // false
 */
export function isNull(value: unknown): value is null {
  return value === null
}
