import type { Err } from './types'

/**
 * Creates an Err result containing an error value.
 *
 * @example
 * const result = err(new Error('failed'))
 * result.ok // false
 * result.error // Error: failed
 */
export function err<E>(error: E): Err<E> {
  return { ok: false, error }
}
