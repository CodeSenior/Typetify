/**
 * Composes functions from right to left.
 * The last function can take multiple arguments.
 *
 * @example
 * const addOne = (n: number) => n + 1
 * const double = (n: number) => n * 2
 * const addOneThenDouble = compose(double, addOne)
 * addOneThenDouble(5) // 12
 */
export function compose<A, B>(fn1: (a: A) => B): (a: A) => B
export function compose<A, B, C>(
  fn2: (b: B) => C,
  fn1: (a: A) => B
): (a: A) => C
export function compose<A, B, C, D>(
  fn3: (c: C) => D,
  fn2: (b: B) => C,
  fn1: (a: A) => B
): (a: A) => D
export function compose<A, B, C, D, E>(
  fn4: (d: D) => E,
  fn3: (c: C) => D,
  fn2: (b: B) => C,
  fn1: (a: A) => B
): (a: A) => E
export function compose<A, B, C, D, E, F>(
  fn5: (e: E) => F,
  fn4: (d: D) => E,
  fn3: (c: C) => D,
  fn2: (b: B) => C,
  fn1: (a: A) => B
): (a: A) => F
export function compose(
  ...fns: ((arg: unknown) => unknown)[]
): (arg: unknown) => unknown {
  return (arg: unknown) => fns.reduceRight((acc, fn) => fn(acc), arg)
}
