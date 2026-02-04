/**
 * Checks if a value is a plain object (created by {} or Object.create(null)).
 * Excludes class instances, arrays, and other object types.
 *
 * @example
 * isPlainObject({}) // true
 * isPlainObject(new Date()) // false
 * isPlainObject([]) // false
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const prototype = Object.getPrototypeOf(value)
  return prototype === null || prototype === Object.prototype
}
