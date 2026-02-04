import type { Ok } from './types'

/**
 * Creates an Ok result containing a success value.
 *
 * @example
 * const result = ok(42)
 * result.ok // true
 * result.value // 42
 */
export function ok<T>(value: T): Ok<T> {
  return { ok: true, value }
}
