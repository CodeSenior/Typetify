/**
 * Checks if a value is a valid Date object.
 * Returns false for invalid dates (e.g., new Date('invalid')).
 *
 * @example
 * isDate(new Date()) // true
 * isDate(new Date('invalid')) // false
 * isDate('2024-01-01') // false
 */
export function isDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}
