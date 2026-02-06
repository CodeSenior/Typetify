import { toInteger } from './toInteger'

/**
 * Converts value to an integer suitable for use as the length of an array-like object.
 *
 * @example
 * toLength(3.2) // 3
 * toLength(-1) // 0
 * toLength(Infinity) // 4294967295
 */
export function toLength(value: unknown): number {
  const MAX_ARRAY_LENGTH = 4294967295
  const result = toInteger(value)
  if (result < 0) return 0
  if (result > MAX_ARRAY_LENGTH) return MAX_ARRAY_LENGTH
  return result
}
