import type { Result, Option } from './types'

/**
 * Unwraps a Result, throwing if it's an Err.
 * Use only when you're certain the result is Ok.
 *
 * @example
 * const value = unwrap(ok(42)) // 42
 * const value = unwrap(err('failed')) // throws Error
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (result.ok) {
    return result.value
  }
  throw result.error instanceof Error
    ? result.error
    : new Error(String(result.error))
}

/**
 * Unwraps an Option, throwing if it's None.
 * Use only when you're certain the option is Some.
 *
 * @example
 * const value = unwrapOption(some(42)) // 42
 * const value = unwrapOption(none()) // throws Error
 */
export function unwrapOption<T>(option: Option<T>): T {
  if (option.some) {
    return option.value
  }
  throw new Error('Called unwrapOption on None')
}
