/**
 * Calculates the percentage of a value relative to a total.
 *
 * @example
 * percentage(25, 100) // 25
 * percentage(1, 4) // 25
 * percentage(0, 100) // 0
 */
export function percentage(value: number, total: number): number {
  if (total === 0) return 0
  return (value / total) * 100
}
