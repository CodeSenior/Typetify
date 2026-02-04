/**
 * Pattern matching with multiple conditions.
 * Replaces nested ternaries or switch statements.
 *
 * @example
 * const message = cond(
 *   [score >= 90, 'Excellent'],
 *   [score >= 70, 'Good'],
 *   [score >= 50, 'Pass'],
 *   [true, 'Fail'] // default
 * )
 *
 * // Instead of:
 * const message = score >= 90 ? 'Excellent'
 *   : score >= 70 ? 'Good'
 *   : score >= 50 ? 'Pass'
 *   : 'Fail'
 */
export function cond<T>(
  ...pairs: readonly [condition: unknown, value: T][]
): T | undefined {
  for (const [condition, value] of pairs) {
    if (condition) {
      return value
    }
  }
  return undefined
}

/**
 * Lazy version - evaluates functions instead of values.
 *
 * @example
 * const result = condLazy(
 *   [isAdmin, () => getAdminData()],
 *   [isUser, () => getUserData()],
 *   [true, () => getGuestData()]
 * )
 */
export function condLazy<T>(
  ...pairs: readonly [condition: unknown, fn: () => T][]
): T | undefined {
  for (const [condition, fn] of pairs) {
    if (condition) {
      return fn()
    }
  }
  return undefined
}

/**
 * Cond with predicate functions for more complex matching.
 *
 * @example
 * const category = condBy(
 *   age,
 *   [n => n < 13, 'child'],
 *   [n => n < 20, 'teen'],
 *   [n => n < 60, 'adult'],
 *   [() => true, 'senior']
 * )
 */
export function condBy<V, T>(
  value: V,
  ...pairs: readonly [predicate: (v: V) => boolean, result: T][]
): T | undefined {
  for (const [predicate, result] of pairs) {
    if (predicate(value)) {
      return result
    }
  }
  return undefined
}
