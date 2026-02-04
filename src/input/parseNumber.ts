/**
 * Parses a value to a number. Returns undefined if parsing fails.
 * Handles strings, numbers, and null/undefined.
 *
 * @example
 * parseNumber('42') // 42
 * parseNumber('3.14') // 3.14
 * parseNumber('abc') // undefined
 * parseNumber(null) // undefined
 */
export function parseNumber(value: unknown): number | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : value
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') {
      return undefined
    }

    const parsed = Number(trimmed)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  return undefined
}
