/**
 * Creates a function that accepts only one argument, ignoring additional arguments.
 *
 * @example
 * ['1', '2', '3'].map(unary(parseInt)) // [1, 2, 3]
 */
export function unary<T extends (...args: any[]) => any>(
  fn: T
): (arg: Parameters<T>[0]) => ReturnType<T> {
  return function (arg: Parameters<T>[0]): ReturnType<T> {
    return fn(arg)
  }
}
