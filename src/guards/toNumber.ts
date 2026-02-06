/**
 * Converts value to a number.
 *
 * @example
 * toNumber(3.2) // 3.2
 * toNumber('3.2') // 3.2
 * toNumber(Infinity) // Infinity
 * toNumber('abc') // NaN
 */
export function toNumber(value: unknown): number {
  if (typeof value === 'number') return value
  if (typeof value === 'symbol') return NaN
  return Number(value)
}
