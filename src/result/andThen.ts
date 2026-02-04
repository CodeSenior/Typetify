import type { Result } from './types'

/**
 * Chains a Result-returning function. Also known as flatMap or bind.
 * If the result is Err, returns it unchanged.
 *
 * @example
 * const parseAndDouble = (s: string) =>
 *   andThen(safeJsonParse(s), n => ok(n * 2))
 */
export function andThen<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  if (result.ok) {
    return fn(result.value)
  }
  return result
}
