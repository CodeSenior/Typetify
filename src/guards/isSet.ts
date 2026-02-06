/**
 * Checks if value is a Set.
 *
 * @example
 * isSet(new Set()) // true
 * isSet(new WeakSet()) // false
 * isSet([]) // false
 */
export function isSet(value: unknown): value is Set<unknown> {
  return value instanceof Set
}
