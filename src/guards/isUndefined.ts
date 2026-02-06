/**
 * Checks if value is undefined.
 *
 * @example
 * isUndefined(undefined) // true
 * isUndefined(null) // false
 * isUndefined(void 0) // true
 */
export function isUndefined(value: unknown): value is undefined {
  return value === undefined
}
