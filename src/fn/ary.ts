/**
 * Creates a function that accepts up to n arguments, ignoring additional arguments.
 *
 * @example
 * const fn = ary(parseInt, 1)
 * ['1', '2', '3'].map(fn) // [1, 2, 3] instead of [1, NaN, NaN]
 */
export function ary<T extends (...args: any[]) => any>(
  fn: T,
  n: number
): (...args: any[]) => ReturnType<T> {
  return function (...args: any[]): ReturnType<T> {
    return fn(...args.slice(0, n))
  }
}
