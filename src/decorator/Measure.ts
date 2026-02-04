/**
 * Measures and logs the execution time of a method.
 *
 * @example
 * class DataProcessor {
 *   @Measure()
 *   processData(data: unknown[]) {
 *     // Heavy processing
 *   }
 * }
 * // Logs: "processData took 123.45ms"
 */
export function Measure(options?: { label?: string }): MethodDecorator {
  return function <T>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value as unknown as (...args: unknown[]) => unknown

    if (typeof originalMethod !== 'function') {
      throw new Error('@Measure can only be applied to methods')
    }

    const label = options?.label ?? String(propertyKey)

    descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
      const start = performance.now()
      const result = originalMethod.apply(this, args)

      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - start
          console.log(`${label} took ${duration.toFixed(2)}ms`)
        })
      }

      const duration = performance.now() - start
      console.log(`${label} took ${duration.toFixed(2)}ms`)
      return result
    } as unknown as T

    return descriptor
  }
}
