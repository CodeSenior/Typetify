import type { Result } from './types'

/**
 * Type guard to check if a Result is Ok.
 *
 * @example
 * if (isOk(result)) {
 *   console.log(result.value) // TypeScript knows this is safe
 * }
 */
export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T; error?: never } {
  return result.ok
}

/**
 * Type guard to check if a Result is Err.
 *
 * @example
 * if (isErr(result)) {
 *   console.log(result.error) // TypeScript knows this is safe
 * }
 */
export function isErr<T, E>(result: Result<T, E>): result is { ok: false; value?: never; error: E } {
  return !result.ok
}
