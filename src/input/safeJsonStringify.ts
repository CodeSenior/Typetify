import type { Result } from '../result/types'
import { ok } from '../result/ok'
import { err } from '../result/err'

/**
 * @deprecated Use Result<string> instead
 */
export type JsonStringifyResult = Result<string, Error>

/**
 * Safely stringifies a value to JSON. Returns a Result instead of throwing.
 * Handles circular references gracefully.
 *
 * @example
 * const result = safeJsonStringify({ name: 'John' })
 * if (result.ok) {
 *   console.log(result.value)
 * }
 */
export function safeJsonStringify(
  value: unknown,
  replacer?: (key: string, value: unknown) => unknown,
  space?: string | number
): Result<string, Error> {
  try {
    const data = JSON.stringify(value, replacer, space)
    return ok(data)
  } catch (error) {
    return err(error instanceof Error ? error : new Error(String(error)))
  }
}
