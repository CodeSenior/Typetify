/**
 * Type-safe pattern matching on values.
 * Replaces switch statements with exhaustive checking.
 *
 * @example
 * type Status = 'pending' | 'success' | 'error'
 *
 * const message = matchValue(status, {
 *   pending: 'Loading...',
 *   success: 'Done!',
 *   error: 'Failed!',
 * })
 *
 * // Instead of:
 * let message: string
 * switch (status) {
 *   case 'pending': message = 'Loading...'; break
 *   case 'success': message = 'Done!'; break
 *   case 'error': message = 'Failed!'; break
 * }
 */
export function matchValue<T extends string | number, R>(
  value: T,
  cases: Record<T, R>
): R {
  return cases[value]
}

/**
 * Pattern matching with a default case.
 *
 * @example
 * const icon = matchWithDefault(status, {
 *   success: '✓',
 *   error: '✗',
 * }, '?')
 */
export function matchWithDefault<T extends string | number, R, D>(
  value: T,
  cases: Partial<Record<T, R>>,
  defaultValue: D
): R | D {
  const result = cases[value]
  return result !== undefined ? result : defaultValue
}

/**
 * Lazy pattern matching - executes functions.
 *
 * @example
 * const result = matchLazy(action.type, {
 *   increment: () => state + 1,
 *   decrement: () => state - 1,
 *   reset: () => 0,
 * })
 */
export function matchLazy<T extends string | number, R>(
  value: T,
  cases: Record<T, () => R>
): R {
  return cases[value]()
}

/**
 * Pattern matching with type guards.
 *
 * @example
 * const result = matchType(value, [
 *   [isString, (s) => s.toUpperCase()],
 *   [isNumber, (n) => n * 2],
 *   [isArray, (arr) => arr.length],
 * ])
 */
export function matchType<T, R>(
  value: T,
  matchers: readonly [guard: (v: T) => boolean, handler: (v: T) => R][]
): R | undefined {
  for (const [guard, handler] of matchers) {
    if (guard(value)) {
      return handler(value)
    }
  }
  return undefined
}
