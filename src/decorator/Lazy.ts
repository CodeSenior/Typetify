/**
 * Lazily initializes a property on first access.
 *
 * @example
 * class Service {
 *   @Lazy()
 *   get expensiveData(): Data {
 *     return computeExpensiveData()
 *   }
 * }
 */
export function Lazy(): MethodDecorator {
  return function <T>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const getter = descriptor.get

    if (typeof getter !== 'function') {
      throw new Error('@Lazy can only be applied to getters')
    }

    descriptor.get = function (this: object): T {
      const value = getter.call(this)
      Object.defineProperty(this, propertyKey, {
        value,
        configurable: false,
        writable: false,
      })
      return value
    }

    return descriptor
  }
}
