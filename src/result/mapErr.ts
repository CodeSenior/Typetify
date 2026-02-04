import type { Result } from './types'
import { err } from './err'

/**
 * Maps a Result's Err value using a function.
 * If the result is Ok, returns it unchanged.
 *
 * @example
 * mapErr(err('failed'), e => new Error(e)) // err(Error('failed'))
 * mapErr(ok(5), e => new Error(e)) // ok(5)
 */
export function mapErr<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> {
  if (!result.ok) {
    return err(fn(result.error))
  }
  return result
}
