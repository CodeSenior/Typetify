/**
 * Creates a curried version of a function.
 * The curried function can be called with fewer arguments,
 * returning a new function that takes the remaining arguments.
 *
 * @example
 * const add = (a: number, b: number, c: number) => a + b + c
 * const curriedAdd = curry(add)
 * curriedAdd(1)(2)(3) // 6
 * curriedAdd(1, 2)(3) // 6
 * curriedAdd(1)(2, 3) // 6
 */
export function curry<T extends (...args: any[]) => any>(
  fn: T
): (...args: any[]) => any {
  const arity = fn.length

  function curried(...args: any[]): any {
    if (args.length >= arity) {
      return fn(...args)
    }
    return (...moreArgs: any[]) => curried(...args, ...moreArgs)
  }

  return curried
}
