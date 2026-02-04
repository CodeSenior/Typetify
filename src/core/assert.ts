/**
 * Asserts that a condition is truthy. Throws an error if not.
 * TypeScript will narrow the type after this assertion.
 *
 * @example
 * const user: User | null = getUser()
 * assert(user, 'User not found')
 * // user is now User (not null)
 */
export function assert(
  condition: unknown,
  message: string = 'Assertion failed'
): asserts condition {
  if (!condition) {
    throw new Error(message)
  }
}
