/**
 * Checks if a value is empty.
 * - String: empty or whitespace only
 * - Array: length is 0
 * - Object: no own enumerable keys
 * - null/undefined: true
 * - Map/Set: size is 0
 *
 * @example
 * isEmpty('') // true
 * isEmpty('  ') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * isEmpty(null) // true
 * isEmpty([1]) // false
 */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) {
    return true
  }

  if (typeof value === 'string') {
    return value.trim().length === 0
  }

  if (Array.isArray(value)) {
    return value.length === 0
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }

  if (typeof value === 'object') {
    return Object.keys(value).length === 0
  }

  return false
}
