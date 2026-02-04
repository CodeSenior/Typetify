/**
 * Conditionally applies a transformation.
 * If the predicate is true, applies the transform. Otherwise returns the value unchanged.
 *
 * @example
 * const maybeDouble = when(
 *   (n: number) => n > 10,
 *   (n) => n * 2
 * )
 * maybeDouble(5) // 5
 * maybeDouble(15) // 30
 */
export function when<T>(
  predicate: (value: T) => boolean,
  transform: (value: T) => T
): (value: T) => T {
  return (value: T): T => {
    if (predicate(value)) {
      return transform(value)
    }
    return value
  }
}
