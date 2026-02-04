/**
 * Memoizes a method, caching its results based on arguments.
 *
 * @example
 * class Calculator {
 *   @Memoize()
 *   fibonacci(n: number): number {
 *     if (n <= 1) return n
 *     return this.fibonacci(n - 1) + this.fibonacci(n - 2)
 *   }
 * }
 */
export function Memoize(
  resolver?: (...args: unknown[]) => unknown
): MethodDecorator {
  return function <T>(
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value as unknown as (...args: unknown[]) => unknown

    if (typeof originalMethod !== 'function') {
      throw new Error('@Memoize can only be applied to methods')
    }

    const cache = new Map<unknown, unknown>()

    descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
      const key = resolver ? resolver(...args) : args[0]

      if (cache.has(key)) {
        return cache.get(key)
      }

      const result = originalMethod.apply(this, args)
      cache.set(key, result)
      return result
    } as unknown as T

    return descriptor
  }
}
