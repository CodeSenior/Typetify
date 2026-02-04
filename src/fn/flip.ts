/**
 * Creates a function that invokes the original function with arguments reversed.
 *
 * @example
 * const divide = (a: number, b: number) => a / b
 * const flipped = flip(divide)
 * flipped(2, 10) // 5 (10 / 2)
 */
export function flip<A, B, R>(
  fn: (a: A, b: B) => R
): (b: B, a: A) => R {
  return function (b: B, a: A): R {
    return fn(a, b)
  }
}
