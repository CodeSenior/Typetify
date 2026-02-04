/**
 * Returns true if any element in the iterable matches the predicate.
 *
 * @example
 * some([1, 2, 3], x => x > 2) // true
 * some([1, 2, 3], x => x > 5) // false
 */
export function some<T>(
  source: Iterable<T>,
  predicate: (value: T) => boolean
): boolean {
  for (const value of source) {
    if (predicate(value)) return true
  }
  return false
}
