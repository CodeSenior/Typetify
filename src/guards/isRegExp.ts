/**
 * Checks if value is a RegExp.
 *
 * @example
 * isRegExp(/abc/) // true
 * isRegExp(new RegExp('abc')) // true
 * isRegExp('/abc/') // false
 */
export function isRegExp(value: unknown): value is RegExp {
  return value instanceof RegExp
}
