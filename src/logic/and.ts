/**
 * Returns the last value if all values are truthy, otherwise the first falsy value.
 * Replaces: `a && b && c`
 *
 * @example
 * const result = and(user, user.isActive, user.hasPermission)
 * // Instead of: user && user.isActive && user.hasPermission
 *
 * // With callback
 * const data = and(isReady, hasData, () => processData())
 */
export function and<T>(...values: readonly T[]): T | undefined {
  if (values.length === 0) return undefined

  for (let i = 0; i < values.length - 1; i++) {
    const value = values[i]
    if (!value) return value
  }

  const last = values[values.length - 1]
  return typeof last === 'function' ? (last as () => T)() : last
}

/**
 * Returns true if all values are truthy.
 *
 * @example
 * if (allTrue(isLoggedIn, hasPermission, isActive)) {
 *   // proceed
 * }
 */
export function allTrue(...values: readonly unknown[]): boolean {
  return values.every(Boolean)
}

/**
 * Returns the result of the callback if all conditions are truthy.
 *
 * @example
 * const result = andThen(
 *   [user, user?.isAdmin, user?.canEdit],
 *   () => editDocument()
 * )
 */
export function andThen<T>(
  conditions: readonly unknown[],
  fn: () => T
): T | undefined {
  return conditions.every(Boolean) ? fn() : undefined
}
