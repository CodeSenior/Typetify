/**
 * Parses a value to a boolean. Returns undefined if parsing fails.
 * Recognizes: true/false, 'true'/'false', '1'/'0', 1/0, 'yes'/'no', 'on'/'off'
 *
 * @example
 * parseBoolean('true') // true
 * parseBoolean('false') // false
 * parseBoolean(1) // true
 * parseBoolean('yes') // true
 * parseBoolean('maybe') // undefined
 */
export function parseBoolean(value: unknown): boolean | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'boolean') {
    return value
  }

  if (typeof value === 'number') {
    if (value === 1) return true
    if (value === 0) return false
    return undefined
  }

  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim()

    if (['true', '1', 'yes', 'on'].includes(lower)) {
      return true
    }

    if (['false', '0', 'no', 'off'].includes(lower)) {
      return false
    }
  }

  return undefined
}
