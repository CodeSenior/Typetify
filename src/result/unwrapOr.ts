import type { Result, Option } from './types'

/**
 * Unwraps a Result, returning the Ok value or a default.
 *
 * @example
 * unwrapOr(ok(5), 0) // 5
 * unwrapOr(err('failed'), 0) // 0
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  return result.ok ? result.value : defaultValue
}

/**
 * Unwraps an Option, returning the Some value or a default.
 *
 * @example
 * unwrapOptionOr(some(5), 0) // 5
 * unwrapOptionOr(none(), 0) // 0
 */
export function unwrapOptionOr<T>(option: Option<T>, defaultValue: T): T {
  return option.some ? option.value : defaultValue
}
