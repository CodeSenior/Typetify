/**
 * Retries a method on failure.
 *
 * @example
 * class ApiClient {
 *   @Retry({ attempts: 3, delay: 1000 })
 *   async fetchData(): Promise<Data> {
 *     return fetch('/api/data').then(r => r.json())
 *   }
 * }
 */
export function Retry(options?: {
  attempts?: number
  delay?: number
  onRetry?: (error: unknown, attempt: number) => void
}): MethodDecorator {
  const attempts = options?.attempts ?? 3
  const delay = options?.delay ?? 0
  const onRetry = options?.onRetry

  return function <T>(
    _target: object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value as unknown as (...args: unknown[]) => unknown

    if (typeof originalMethod !== 'function') {
      throw new Error('@Retry can only be applied to methods')
    }

    descriptor.value = async function (this: unknown, ...args: unknown[]): Promise<unknown> {
      let lastError: unknown

      for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
          const result = originalMethod.apply(this, args)
          if (result instanceof Promise) {
            return await result
          }
          return result
        } catch (error) {
          lastError = error
          if (attempt < attempts) {
            onRetry?.(error, attempt)
            if (delay > 0) {
              await new Promise((resolve) => setTimeout(resolve, delay))
            }
          }
        }
      }

      throw lastError
    } as unknown as T

    return descriptor
  }
}
