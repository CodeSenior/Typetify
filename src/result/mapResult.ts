import type { Result } from './types'
import { ok } from './ok'

/**
 * Maps a Result's Ok value using a function.
 * If the result is Err, returns it unchanged.
 *
 * @example
 * mapResult(ok(5), n => n * 2) // ok(10)
 * mapResult(err('failed'), n => n * 2) // err('failed')
 */
export function mapResult<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (result.ok) {
    return ok(fn(result.value))
  }
  return result
}
