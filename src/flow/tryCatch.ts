import type { Result } from '../result/types'
import { ok } from '../result/ok'
import { err } from '../result/err'

/**
 * @deprecated Use Result<T> instead
 */
export type TryCatchResult<T> = Result<T, Error>

/**
 * Wraps a function call in a try/catch and returns a Result.
 *
 * @example
 * const result = tryCatch(() => JSON.parse(input))
 * if (result.ok) {
 *   console.log(result.value)
 * } else {
 *   console.error(result.error)
 * }
 */
export function tryCatch<T>(fn: () => T): Result<T, Error> {
  try {
    return ok(fn())
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}
