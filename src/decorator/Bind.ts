/**
 * Binds a method to its class instance.
 * Useful for event handlers and callbacks.
 *
 * @example
 * class Button {
 *   @Bind()
 *   onClick() {
 *     console.log(this) // Always the Button instance
 *   }
 * }
 */
export function Bind(): MethodDecorator {
  return function <T>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value

    if (typeof originalMethod !== 'function') {
      throw new Error('@Bind can only be applied to methods')
    }

    return {
      configurable: true,
      enumerable: false,
      get(this: object): T {
        const bound = (originalMethod as (...args: unknown[]) => unknown).bind(this)
        Object.defineProperty(this, propertyKey, {
          value: bound,
          configurable: true,
          writable: true,
        })
        return bound as T
      },
    }
  }
}
