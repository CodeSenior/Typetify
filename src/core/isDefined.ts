/**
 * Checks if a value is defined (not null and not undefined).
 * Perfect for use with Array.filter() to narrow types.
 *
 * @example
 * const items = [1, null, 2, undefined, 3]
 * const defined = items.filter(isDefined) // number[]
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
