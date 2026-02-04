/**
 * Parses a value to a Date. Returns undefined if parsing fails or date is invalid.
 *
 * @example
 * parseDate('2024-01-15') // Date object
 * parseDate(1705276800000) // Date object
 * parseDate('invalid') // undefined
 */
export function parseDate(value: unknown): Date | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value
  }

  if (typeof value === 'number') {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? undefined : date
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') {
      return undefined
    }

    const date = new Date(trimmed)
    return Number.isNaN(date.getTime()) ? undefined : date
  }

  return undefined
}
