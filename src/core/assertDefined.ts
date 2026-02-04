/**
 * Asserts that a value is defined (not null and not undefined).
 * Throws an error if the value is null or undefined.
 *
 * @example
 * const user: User | null = getUser()
 * assertDefined(user, 'User not found')
 * // user is now User
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message: string = 'Value is not defined'
): asserts value is T {
  if (value === null || value === undefined) {
    throw new Error(message)
  }
}
