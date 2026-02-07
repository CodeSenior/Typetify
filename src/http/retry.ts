import { request, type RequestOptions, type HttpResponse, HttpError } from './request'

/**
 * Retry configuration options.
 */
export interface RetryOptions {
  maxRetries?: number
  delay?: number
  backoff?: 'linear' | 'exponential'
  retryOn?: (error: Error, attempt: number) => boolean
}

/**
 * Default retry condition - retry on network errors and 5xx status codes.
 */
function defaultRetryOn(error: Error): boolean {
  if (error instanceof HttpError) {
    return error.status >= 500 && error.status < 600
  }
  return error.name === 'TypeError' || error.name === 'AbortError'
}

/**
 * Calculates delay based on backoff strategy.
 */
function calculateDelay(
  attempt: number,
  baseDelay: number,
  backoff: 'linear' | 'exponential'
): number {
  if (backoff === 'exponential') {
    return baseDelay * Math.pow(2, attempt - 1)
  }
  return baseDelay * attempt
}

/**
 * Makes an HTTP request with automatic retry on failure.
 *
 * @example
 * // Basic retry with defaults (3 retries, 1s delay)
 * const response = await requestWithRetry<User>('https://api.example.com/users/1');
 *
 * @example
 * // Custom retry configuration
 * const response = await requestWithRetry<User>('https://api.example.com/users/1', {
 *   maxRetries: 5,
 *   delay: 2000,
 *   backoff: 'exponential'
 * });
 *
 * @example
 * // Custom retry condition
 * const response = await requestWithRetry<User>('https://api.example.com/users/1', {
 *   retryOn: (error, attempt) => {
 *     if (error instanceof HttpError && error.status === 429) {
 *       return attempt < 5; // Retry rate limiting up to 5 times
 *     }
 *     return false;
 *   }
 * });
 */
export async function requestWithRetry<T>(
  url: string,
  options: RequestOptions & RetryOptions = {}
): Promise<HttpResponse<T>> {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 'exponential',
    retryOn = defaultRetryOn,
    ...requestOptions
  } = options

  let lastError: Error | undefined

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await request<T>(url, requestOptions)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      if (attempt <= maxRetries && retryOn(lastError, attempt)) {
        const waitTime = calculateDelay(attempt, delay, backoff)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }

      throw lastError
    }
  }

  throw lastError
}

/**
 * Creates a retry wrapper for any async function.
 *
 * @example
 * const fetchWithRetry = withRetry(async (id: string) => {
 *   const response = await fetch(`/api/users/${id}`);
 *   return response.json();
 * }, { maxRetries: 3 });
 *
 * const user = await fetchWithRetry('123');
 */
export function withRetry<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: RetryOptions = {}
): T {
  const {
    maxRetries = 3,
    delay = 1000,
    backoff = 'exponential',
    retryOn = defaultRetryOn,
  } = options

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    let lastError: Error | undefined

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return (await fn(...args)) as ReturnType<T>
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        if (attempt <= maxRetries && retryOn(lastError, attempt)) {
          const waitTime = calculateDelay(attempt, delay, backoff)
          await new Promise((resolve) => setTimeout(resolve, waitTime))
          continue
        }

        throw lastError
      }
    }

    throw lastError
  }) as T
}
