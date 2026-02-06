import { toInteger } from './toInteger'

/**
 * Converts value to a safe integer.
 *
 * @example
 * toSafeInteger(3.2) // 3
 * toSafeInteger(Infinity) // 9007199254740991
 * toSafeInteger('3.2') // 3
 */
export function toSafeInteger(value: unknown): number {
  const result = toInteger(value)
  if (result < Number.MIN_SAFE_INTEGER) return Number.MIN_SAFE_INTEGER
  if (result > Number.MAX_SAFE_INTEGER) return Number.MAX_SAFE_INTEGER
  return result
}
