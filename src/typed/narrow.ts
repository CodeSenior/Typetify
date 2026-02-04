/**
 * Narrows a value to a specific type using a type guard.
 * Returns the value if it passes the guard, undefined otherwise.
 *
 * @example
 * const value: unknown = 'hello'
 * const str = narrow(value, isString)
 * // str is string | undefined
 */
export function narrow<T, U extends T>(
  value: T,
  guard: (value: T) => value is U
): U | undefined {
  return guard(value) ? value : undefined
}
