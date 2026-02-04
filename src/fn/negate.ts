/**
 * Creates a function that negates the result of the predicate.
 *
 * @example
 * const isEven = (n: number) => n % 2 === 0
 * const isOdd = negate(isEven)
 * isOdd(3) // true
 * isOdd(4) // false
 */
export function negate<T extends (...args: any[]) => boolean>(
  fn: T
): (...args: Parameters<T>) => boolean {
  return function (...args: Parameters<T>): boolean {
    return !fn(...args)
  }
}
