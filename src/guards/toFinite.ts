/**
 * Converts value to a finite number.
 *
 * @example
 * toFinite(3.2) // 3.2
 * toFinite(Infinity) // 1.7976931348623157e+308
 * toFinite('3.2') // 3.2
 */
export function toFinite(value: unknown): number {
  if (value === null || value === undefined) return 0
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return value > 0 ? Number.MAX_VALUE : -Number.MAX_VALUE
    }
    return value
  }
  const num = Number(value)
  if (Number.isNaN(num)) return 0
  if (!Number.isFinite(num)) {
    return num > 0 ? Number.MAX_VALUE : -Number.MAX_VALUE
  }
  return num
}
