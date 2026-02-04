/**
 * Debounces a method, delaying execution until after wait milliseconds.
 *
 * @example
 * class SearchBox {
 *   @Debounce(300)
 *   search(query: string) {
 *     console.log('Searching:', query)
 *   }
 * }
 */
export function Debounce(wait: number): MethodDecorator {
  return function <T>(
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value as unknown as (...args: unknown[]) => unknown

    if (typeof originalMethod !== 'function') {
      throw new Error('@Debounce can only be applied to methods')
    }

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    descriptor.value = function (this: unknown, ...args: unknown[]): void {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        originalMethod.apply(this, args)
      }, wait)
    } as unknown as T

    return descriptor
  }
}
