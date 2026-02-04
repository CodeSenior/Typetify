/**
 * Tries to get a value, catching any errors.
 * Useful for accessing properties that might throw.
 *
 * @example
 * const value = tryGet(() => JSON.parse(str).data.value)
 * // Instead of: try { JSON.parse(str).data.value } catch { undefined }
 */
export function tryGet<T>(fn: () => T): T | undefined {
  try {
    return fn()
  } catch {
    return undefined
  }
}

/**
 * Tries to get a value, returning default on error.
 *
 * @example
 * const config = tryGetOr(() => JSON.parse(str), defaultConfig)
 */
export function tryGetOr<T>(fn: () => T, defaultValue: T): T {
  try {
    return fn()
  } catch {
    return defaultValue
  }
}

/**
 * Tries to get a value, returning Result type.
 *
 * @example
 * const result = tryGetResult(() => riskyOperation())
 * if (result.ok) {
 *   console.log(result.value)
 * } else {
 *   console.error(result.error)
 * }
 */
export function tryGetResult<T>(
  fn: () => T
): { ok: true; value: T } | { ok: false; error: unknown } {
  try {
    return { ok: true, value: fn() }
  } catch (error) {
    return { ok: false, error }
  }
}
