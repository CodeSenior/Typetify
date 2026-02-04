import type { Result, Option } from './types'

/**
 * Pattern matches on a Result, executing the appropriate handler.
 *
 * @example
 * const message = matchResult(result, {
 *   ok: value => `Success: ${value}`,
 *   err: error => `Failed: ${error.message}`
 * })
 */
export function matchResult<T, E, U>(
  result: Result<T, E>,
  handlers: {
    ok: (value: T) => U
    err: (error: E) => U
  }
): U {
  if (result.ok) {
    return handlers.ok(result.value)
  }
  return handlers.err(result.error)
}

/**
 * Pattern matches on an Option, executing the appropriate handler.
 *
 * @example
 * const message = matchOption(option, {
 *   some: value => `Found: ${value}`,
 *   none: () => 'Not found'
 * })
 */
export function matchOption<T, U>(
  option: Option<T>,
  handlers: {
    some: (value: T) => U
    none: () => U
  }
): U {
  if (option.some) {
    return handlers.some(option.value)
  }
  return handlers.none()
}
