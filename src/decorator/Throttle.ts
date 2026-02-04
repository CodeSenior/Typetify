/**
 * Throttles a method, limiting execution to once per wait milliseconds.
 *
 * @example
 * class ScrollHandler {
 *   @Throttle(100)
 *   onScroll(event: Event) {
 *     console.log('Scroll event')
 *   }
 * }
 */
export function Throttle(wait: number): MethodDecorator {
  return function <T>(
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value as unknown as (...args: unknown[]) => unknown

    if (typeof originalMethod !== 'function') {
      throw new Error('@Throttle can only be applied to methods')
    }

    let lastCall = 0
    let timeoutId: ReturnType<typeof setTimeout> | undefined

    descriptor.value = function (this: unknown, ...args: unknown[]): void {
      const now = Date.now()
      const remaining = wait - (now - lastCall)

      if (remaining <= 0) {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId)
          timeoutId = undefined
        }
        lastCall = now
        originalMethod.apply(this, args)
      } else if (timeoutId === undefined) {
        timeoutId = setTimeout(() => {
          lastCall = Date.now()
          timeoutId = undefined
          originalMethod.apply(this, args)
        }, remaining)
      }
    } as unknown as T

    return descriptor
  }
}
