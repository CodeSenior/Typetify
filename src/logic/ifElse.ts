/**
 * Returns one of two values based on a condition.
 * Replaces: `condition ? valueA : valueB`
 *
 * @example
 * const status = ifElse(isOnline, 'Online', 'Offline')
 * const greeting = ifElse(user.name, `Hello ${user.name}`, 'Hello Guest')
 *
 * // Instead of:
 * const status = isOnline ? 'Online' : 'Offline'
 */
export function ifElse<T, F>(
  condition: unknown,
  whenTrue: T,
  whenFalse: F
): T | F {
  return condition ? whenTrue : whenFalse
}

/**
 * Lazy version - executes functions instead of evaluating values.
 * Useful when values are expensive to compute.
 *
 * @example
 * const result = ifElseLazy(
 *   shouldCompute,
 *   () => expensiveComputation(),
 *   () => cachedValue
 * )
 */
export function ifElseLazy<T, F>(
  condition: unknown,
  whenTrue: () => T,
  whenFalse: () => F
): T | F {
  return condition ? whenTrue() : whenFalse()
}
