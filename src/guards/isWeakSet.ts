/**
 * Checks if value is a WeakSet.
 *
 * @example
 * isWeakSet(new WeakSet()) // true
 * isWeakSet(new Set()) // false
 */
export function isWeakSet(value: unknown): value is WeakSet<object> {
  return value instanceof WeakSet
}
