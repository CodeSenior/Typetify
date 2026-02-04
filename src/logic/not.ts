/**
 * Negates a value.
 * Replaces: `!value`
 *
 * @example
 * const isInactive = not(user.isActive)
 *
 * // Useful in functional composition
 * users.filter(not(isAdmin))
 */
export function not<T>(value: T): boolean {
  return !value
}

/**
 * Creates a negated predicate function.
 *
 * @example
 * const isNotEmpty = notFn(isEmpty)
 * const validItems = items.filter(isNotEmpty)
 */
export function notFn<T extends readonly unknown[]>(
  predicate: (...args: T) => boolean
): (...args: T) => boolean {
  return (...args: T) => !predicate(...args)
}
