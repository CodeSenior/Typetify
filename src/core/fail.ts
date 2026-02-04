/**
 * Throws an error with the given message.
 * Useful for inline error throwing in expressions.
 *
 * @example
 * const value = maybeValue ?? fail('Value is required')
 */
export function fail(message: string): never {
  throw new Error(message)
}
