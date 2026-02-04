/**
 * Logs method calls with arguments and return values.
 *
 * @example
 * class Calculator {
 *   @Log()
 *   add(a: number, b: number): number {
 *     return a + b
 *   }
 * }
 * // Logs: "add(1, 2) => 3"
 */
export function Log(options?: { prefix?: string }): MethodDecorator {
  const prefix = options?.prefix ?? ''

  return function <T>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value as unknown as (...args: unknown[]) => unknown

    if (typeof originalMethod !== 'function') {
      throw new Error('@Log can only be applied to methods')
    }

    descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
      const methodName = String(propertyKey)
      const argsStr = args.map((a) => JSON.stringify(a)).join(', ')

      const result = originalMethod.apply(this, args)

      if (result instanceof Promise) {
        return result.then((res) => {
          console.log(`${prefix}${methodName}(${argsStr}) => ${JSON.stringify(res)}`)
          return res
        })
      }

      console.log(`${prefix}${methodName}(${argsStr}) => ${JSON.stringify(result)}`)
      return result
    } as unknown as T

    return descriptor
  }
}
