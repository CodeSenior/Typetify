/**
 * Creates a function with some arguments pre-filled.
 *
 * @example
 * const greet = (greeting: string, name: string) => `${greeting}, ${name}!`
 * const sayHello = partial(greet, 'Hello')
 * sayHello('World') // 'Hello, World!'
 */
export function partial<T extends (...args: any[]) => any, A extends any[]>(
  fn: T,
  ...partialArgs: A
): (...args: any[]) => ReturnType<T> {
  return function (...args: any[]): ReturnType<T> {
    return fn(...partialArgs, ...args)
  }
}
