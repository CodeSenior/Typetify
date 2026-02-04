import type { Result } from '../result/types'
import { ok } from '../result/ok'
import { err } from '../result/err'

/**
 * @deprecated Use Result<T> instead
 */
export type TryCatchAsyncResult<T> = Result<T, Error>

/**
 * Wraps an async function call in a try/catch and returns a Result.
 *
 * @example
 * const result = await tryCatchAsync(() => fetchUser(id))
 * if (result.ok) {
 *   console.log(result.value)
 * } else {
 *   console.error(result.error)
 * }
 */
export async function tryCatchAsync<T>(
  fn: () => Promise<T>
): Promise<Result<T, Error>> {
  try {
    const value = await fn()
    return ok(value)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}
