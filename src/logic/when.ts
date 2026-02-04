/**
 * Executes a function when condition is truthy.
 * Replaces: `condition && doSomething()`
 *
 * @example
 * when(user.isAdmin, () => showAdminPanel())
 * when(count > 0, () => processItems(count))
 *
 * // Instead of:
 * user.isAdmin && showAdminPanel()
 */
export function when<T>(
  condition: unknown,
  fn: () => T
): T | undefined {
  if (condition) {
    return fn()
  }
  return undefined
}

/**
 * Returns value when condition is truthy, undefined otherwise.
 * Replaces: `condition && value`
 *
 * @example
 * const className = whenValue(isActive, 'active')
 * // Instead of: isActive && 'active'
 */
export function whenValue<T>(
  condition: unknown,
  value: T
): T | undefined {
  return condition ? value : undefined
}
