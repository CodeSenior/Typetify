/**
 * Converts value to a string. Null and undefined return empty string.
 *
 * @example
 * toString(null) // ''
 * toString(-0) // '-0'
 * toString([1, 2, 3]) // '1,2,3'
 */
export function toString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.join(',')
  if (Object.is(value, -0)) return '-0'
  return String(value)
}
