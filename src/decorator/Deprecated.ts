/**
 * Marks a method as deprecated and logs a warning when called.
 *
 * @example
 * class Api {
 *   @Deprecated('Use newMethod() instead')
 *   oldMethod() {
 *     // ...
 *   }
 * }
 */
export function Deprecated(message?: string): MethodDecorator {
  return function <T>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value as unknown as (...args: unknown[]) => unknown

    if (typeof originalMethod !== 'function') {
      throw new Error('@Deprecated can only be applied to methods')
    }

    const methodName = String(propertyKey)
    const warning = message
      ? `${methodName} is deprecated: ${message}`
      : `${methodName} is deprecated`

    descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
      console.warn(warning)
      return originalMethod.apply(this, args)
    } as unknown as T

    return descriptor
  }
}
