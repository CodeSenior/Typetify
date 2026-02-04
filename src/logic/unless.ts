/**
 * Executes a function unless condition is truthy.
 * Replaces: `!condition && doSomething()`
 *
 * @example
 * unless(user.isBlocked, () => allowAccess())
 *
 * // Instead of:
 * !user.isBlocked && allowAccess()
 */
export function unless<T>(
  condition: unknown,
  fn: () => T
): T | undefined {
  if (!condition) {
    return fn()
  }
  return undefined
}

/**
 * Returns value unless condition is truthy, undefined otherwise.
 *
 * @example
 * const message = unlessValue(isHidden, 'Hello!')
 */
export function unlessValue<T>(
  condition: unknown,
  value: T
): T | undefined {
  return !condition ? value : undefined
}
