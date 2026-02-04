export interface RetryOptions {
  /** Maximum number of attempts (default: 3) */
  attempts?: number
  /** Delay between attempts in ms (default: 1000) */
  delay?: number
  /** Multiply delay by this factor after each attempt (default: 1) */
  backoff?: number
  /** Called when an attempt fails */
  onRetry?: (error: Error, attempt: number) => void
}

/**
 * Retries a function until it succeeds or max attempts is reached.
 *
 * @example
 * const data = await retry(() => fetchData(), {
 *   attempts: 3,
 *   delay: 1000,
 *   backoff: 2,
 * })
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { attempts = 3, delay = 1000, backoff = 1, onRetry } = options

  let lastError: Error | undefined
  let currentDelay = delay

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt < attempts) {
        onRetry?.(lastError, attempt)
        await new Promise((resolve) => setTimeout(resolve, currentDelay))
        currentDelay *= backoff
      }
    }
  }

  throw lastError
}
