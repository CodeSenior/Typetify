/**
 * Creates a type-safe Set with inferred value type.
 *
 * @example
 * const ids = createSet<number>()
 * ids.add(1)
 * ids.has(1) // true
 */
export function createSet<T>(values?: readonly T[]): Set<T> {
  return new Set(values)
}
