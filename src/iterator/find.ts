/**
 * Finds the first element in an iterable that matches the predicate.
 *
 * @example
 * find([1, 2, 3, 4], x => x > 2) // 3
 */
export function find<T>(
  source: Iterable<T>,
  predicate: (value: T) => boolean
): T | undefined {
  for (const value of source) {
    if (predicate(value)) return value
  }
  return undefined
}
