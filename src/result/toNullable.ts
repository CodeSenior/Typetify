import type { Option } from './types'

/**
 * Converts an Option to a nullable value.
 * Returns the value if Some, null if None.
 *
 * @example
 * toNullable(some(5)) // 5
 * toNullable(none()) // null
 */
export function toNullable<T>(option: Option<T>): T | null {
  return option.some ? option.value : null
}
