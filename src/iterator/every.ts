/**
 * Returns true if all elements in the iterable match the predicate.
 *
 * @example
 * every([1, 2, 3], x => x > 0) // true
 * every([1, 2, 3], x => x > 2) // false
 */
export function every<T>(
  source: Iterable<T>,
  predicate: (value: T) => boolean
): boolean {
  for (const value of source) {
    if (!predicate(value)) return false
  }
  return true
}
