/**
 * Checks if value is array-like (has a length property that is a valid array length).
 *
 * @example
 * isArrayLike([1, 2, 3]) // true
 * isArrayLike('abc') // true
 * isArrayLike({ length: 0 }) // true
 * isArrayLike(() => {}) // false
 */
export function isArrayLike(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'function') return false
  
  const length = (value as { length?: unknown }).length
  return typeof length === 'number' && length >= 0 && length <= Number.MAX_SAFE_INTEGER && Number.isInteger(length)
}
