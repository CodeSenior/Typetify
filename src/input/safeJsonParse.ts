import type { Result } from '../result/types'
import { ok } from '../result/ok'
import { err } from '../result/err'

/**
 * @deprecated Use Result<T> instead
 */
export type JsonParseResult<T> = Result<T, Error>

/**
 * Safely parses a JSON string. Returns a Result instead of throwing.
 *
 * @example
 * const result = safeJsonParse<User>('{"name": "John"}')
 * if (result.ok) {
 *   console.log(result.value.name)
 * } else {
 *   console.error(result.error)
 * }
 */
export function safeJsonParse<T = unknown>(json: string): Result<T, Error> {
  try {
    const data = JSON.parse(json) as T
    return ok(data)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}
