/**
 * Performs a SameValueZero comparison between two values.
 *
 * @example
 * eq(1, 1) // true
 * eq('a', 'a') // true
 * eq(NaN, NaN) // true
 * eq({}, {}) // false
 */
export function eq(value: unknown, other: unknown): boolean {
  return value === other || (Number.isNaN(value) && Number.isNaN(other))
}
