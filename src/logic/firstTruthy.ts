/**
 * Returns the first truthy value from an array.
 *
 * @example
 * const source = firstTruthy([null, '', 0, 'hello', 'world'])
 * // 'hello'
 */
export function firstTruthy<T>(values: readonly T[]): T | undefined {
  for (const value of values) {
    if (value) return value
  }
  return undefined
}

/**
 * Returns the first value that passes the predicate.
 *
 * @example
 * const validEmail = firstWhere(
 *   [user.email, user.backupEmail, 'default@example.com'],
 *   isValidEmail
 * )
 */
export function firstWhere<T>(
  values: readonly T[],
  predicate: (value: T) => boolean
): T | undefined {
  for (const value of values) {
    if (predicate(value)) return value
  }
  return undefined
}

/**
 * Returns the first non-nullish value from an array.
 *
 * @example
 * const value = firstDefined([null, undefined, 0, '', false])
 * // 0 (first non-nullish value)
 */
export function firstDefined<T>(
  values: readonly (T | null | undefined)[]
): T | undefined {
  for (const value of values) {
    if (value !== null && value !== undefined) return value
  }
  return undefined
}
