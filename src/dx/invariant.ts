/**
 * Asserts that a condition is true. Throws an error with a descriptive message if not.
 * Similar to assert but with a more descriptive name for invariant checks.
 *
 * @example
 * invariant(user.id > 0, 'User ID must be positive')
 * // Throws: Invariant violation: User ID must be positive
 */
export function invariant(
  condition: unknown,
  message: string
): asserts condition {
  if (!condition) {
    throw new Error(`Invariant violation: ${message}`)
  }
}
