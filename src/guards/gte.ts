/**
 * Checks if value is greater than or equal to other.
 *
 * @example
 * gte(3, 1) // true
 * gte(3, 3) // true
 * gte(1, 3) // false
 */
export function gte(value: number, other: number): boolean {
  return value >= other
}
