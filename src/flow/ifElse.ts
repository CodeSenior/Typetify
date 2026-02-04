/**
 * Functional if/else. Returns a function that applies one of two transformations
 * based on a predicate.
 *
 * @example
 * const formatPrice = ifElse(
 *   (n: number) => n === 0,
 *   () => 'Free',
 *   (n) => `$${n.toFixed(2)}`
 * )
 * formatPrice(0) // 'Free'
 * formatPrice(9.99) // '$9.99'
 */
export function ifElse<T, R>(
  predicate: (value: T) => boolean,
  onTrue: (value: T) => R,
  onFalse: (value: T) => R
): (value: T) => R {
  return (value: T): R => {
    if (predicate(value)) {
      return onTrue(value)
    }
    return onFalse(value)
  }
}
