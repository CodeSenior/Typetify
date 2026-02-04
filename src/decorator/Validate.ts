/**
 * Validates method arguments using a predicate.
 *
 * @example
 * class User {
 *   @Validate((age: number) => age >= 0 && age <= 150, 'Invalid age')
 *   setAge(age: number) {
 *     this.age = age
 *   }
 * }
 */
export function Validate(
  predicate: (...args: unknown[]) => boolean,
  errorMessage?: string
): MethodDecorator {
  return function <T>(
    _target: object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value as unknown as (...args: unknown[]) => unknown

    if (typeof originalMethod !== 'function') {
      throw new Error('@Validate can only be applied to methods')
    }

    const methodName = String(propertyKey)

    descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
      if (!predicate(...args)) {
        throw new Error(
          errorMessage ?? `Validation failed for ${methodName}`
        )
      }
      return originalMethod.apply(this, args)
    } as unknown as T

    return descriptor
  }
}
