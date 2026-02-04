/**
 * Returns the first truthy value, or the last value if none are truthy.
 * Replaces: `a || b || c`
 *
 * @example
 * const name = or(user.nickname, user.firstName, user.email, 'Anonymous')
 * // Instead of: user.nickname || user.firstName || user.email || 'Anonymous'
 */
export function or<T>(...values: readonly T[]): T | undefined {
  if (values.length === 0) return undefined

  for (const value of values) {
    if (value) return value
  }

  return values[values.length - 1]
}

/**
 * Returns true if any value is truthy.
 *
 * @example
 * if (anyTrue(isAdmin, isModerator, isOwner)) {
 *   // has elevated permissions
 * }
 */
export function anyTrue(...values: readonly unknown[]): boolean {
  return values.some(Boolean)
}

/**
 * Returns the result of the callback if any condition is truthy.
 *
 * @example
 * const result = orThen(
 *   [isAdmin, isModerator],
 *   () => showModTools()
 * )
 */
export function orThen<T>(
  conditions: readonly unknown[],
  fn: () => T
): T | undefined {
  return conditions.some(Boolean) ? fn() : undefined
}
