import type { Some } from './types'

/**
 * Creates a Some option containing a value.
 *
 * @example
 * const option = some(42)
 * option.some // true
 * option.value // 42
 */
export function some<T>(value: T): Some<T> {
  return { some: true, value }
}
