import { toFinite } from './toFinite'

/**
 * Converts value to an integer.
 *
 * @example
 * toInteger(3.2) // 3
 * toInteger('3.2') // 3
 * toInteger(Infinity) // 1.7976931348623157e+308
 */
export function toInteger(value: unknown): number {
  const result = toFinite(value)
  return result === 0 ? 0 : Math.trunc(result)
}
