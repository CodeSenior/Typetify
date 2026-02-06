/**
 * Checks if value is object-like (not null and typeof is 'object').
 *
 * @example
 * isObjectLike({}) // true
 * isObjectLike([1, 2, 3]) // true
 * isObjectLike(null) // false
 * isObjectLike(() => {}) // false
 */
export function isObjectLike(value: unknown): boolean {
  return typeof value === 'object' && value !== null
}
