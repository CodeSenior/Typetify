/**
 * Returns the first non-nullish value (not null or undefined).
 * Replaces: `a ?? b ?? c`
 *
 * @example
 * const value = coalesce(config.timeout, defaultConfig.timeout, 5000)
 * // Instead of: config.timeout ?? defaultConfig.timeout ?? 5000
 *
 * // Handles 0 and '' correctly (unlike ||)
 * coalesce(0, 10) // 0
 * coalesce('', 'default') // ''
 */
export function coalesce<T>(...values: readonly (T | null | undefined)[]): T | undefined {
  for (const value of values) {
    if (value !== null && value !== undefined) {
      return value
    }
  }
  return undefined
}

/**
 * Lazy version - evaluates functions only if needed.
 *
 * @example
 * const config = coalesceLazy(
 *   () => getUserConfig(),
 *   () => getDefaultConfig(),
 *   () => ({ timeout: 5000 })
 * )
 */
export function coalesceLazy<T>(
  ...fns: readonly (() => T | null | undefined)[]
): T | undefined {
  for (const fn of fns) {
    const value = fn()
    if (value !== null && value !== undefined) {
      return value
    }
  }
  return undefined
}
