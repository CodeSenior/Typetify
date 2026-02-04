import type { Result } from './types'

/**
 * Provides a fallback Result if the current one is Err.
 *
 * @example
 * const result = orElse(err('failed'), e => ok('default'))
 */
export function orElse<T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => Result<T, F>
): Result<T, F> {
  if (!result.ok) {
    return fn(result.error)
  }
  return result
}
