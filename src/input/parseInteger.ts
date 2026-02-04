/**
 * Parses a value to an integer. Returns undefined if parsing fails.
 *
 * @example
 * parseInteger('42') // 42
 * parseInteger('3.14') // 3
 * parseInteger('abc') // undefined
 */
export function parseInteger(value: unknown): number | undefined {
  if (value === null || value === undefined) {
    return undefined
  }

  if (typeof value === 'number') {
    return Number.isNaN(value) ? undefined : Math.trunc(value)
  }

  if (typeof value === 'string') {
    const trimmed = value.trim()
    if (trimmed === '') {
      return undefined
    }

    const parsed = parseInt(trimmed, 10)
    return Number.isNaN(parsed) ? undefined : parsed
  }

  return undefined
}
