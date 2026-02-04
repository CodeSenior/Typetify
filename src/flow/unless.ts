/**
 * Conditionally applies a transformation.
 * If the predicate is false, applies the transform. Otherwise returns the value unchanged.
 *
 * @example
 * const ensurePositive = unless(
 *   (n: number) => n > 0,
 *   () => 0
 * )
 * ensurePositive(-5) // 0
 * ensurePositive(5) // 5
 */
export function unless<T>(
  predicate: (value: T) => boolean,
  transform: (value: T) => T
): (value: T) => T {
  return (value: T): T => {
    if (!predicate(value)) {
      return transform(value)
    }
    return value
  }
}
