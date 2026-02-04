/**
 * Rounds a number to a specified precision.
 *
 * @example
 * round(3.14159, 2) // 3.14
 * round(3.5) // 4
 * round(1234.5, -2) // 1200
 */
export function round(num: number, precision: number = 0): number {
  const factor = Math.pow(10, precision)
  return Math.round(num * factor) / factor
}
