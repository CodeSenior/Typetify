/**
 * Returns the value passed to it.
 * Useful for default transformers or as a placeholder function.
 *
 * @example
 * const transform = options.transform ?? identity
 * const result = transform(value)
 */
export function identity<T>(value: T): T {
  return value
}
