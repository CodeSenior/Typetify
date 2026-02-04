/**
 * Coerces a value to a string. Returns empty string for null/undefined.
 *
 * @example
 * coerceString('hello') // 'hello'
 * coerceString(42) // '42'
 * coerceString(null) // ''
 * coerceString(undefined) // ''
 */
export function coerceString(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  if (typeof value === 'string') {
    return value
  }

  return String(value)
}
