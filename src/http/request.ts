/**
 * HTTP request options.
 */
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  baseUrl?: string
  timeout?: number
  params?: Record<string, string | number | boolean | undefined>
  body?: unknown
}

/**
 * HTTP response with typed data.
 */
export interface HttpResponse<T> {
  data: T
  status: number
  statusText: string
  headers: Headers
  ok: boolean
}

/**
 * HTTP error with response details.
 */
export class HttpError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public response?: unknown
  ) {
    super(message)
    this.name = 'HttpError'
  }
}

/**
 * Builds URL with query parameters.
 *
 * @example
 * buildUrl('https://api.example.com/users', { page: 1, limit: 10 });
 * // => 'https://api.example.com/users?page=1&limit=10'
 */
export function buildUrl(
  url: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params) return url

  const searchParams = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      searchParams.append(key, String(value))
    }
  }

  const queryString = searchParams.toString()
  if (!queryString) return url

  return url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
}

/**
 * Makes an HTTP request with timeout and error handling.
 *
 * @example
 * const response = await request<User>('https://api.example.com/users/1');
 * console.log(response.data); // User object
 *
 * @example
 * // POST request
 * const response = await request<User>('https://api.example.com/users', {
 *   method: 'POST',
 *   body: { name: 'John', email: 'john@example.com' }
 * });
 */
export async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<HttpResponse<T>> {
  const { baseUrl, timeout = 30000, params, body, ...fetchOptions } = options

  const fullUrl = buildUrl(baseUrl ? `${baseUrl}${url}` : url, params)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)

  try {
    const response = await fetch(fullUrl, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      body: body ? JSON.stringify(body) : null,
    })

    clearTimeout(timeoutId)

    const data = await response.json().catch(() => null)

    if (!response.ok) {
      throw new HttpError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        response.statusText,
        data
      )
    }

    return {
      data: data as T,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      ok: response.ok,
    }
  } catch (error) {
    clearTimeout(timeoutId)

    if (error instanceof HttpError) {
      throw error
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new HttpError('Request timeout', 408, 'Request Timeout')
    }

    throw error
  }
}

/**
 * Makes a GET request.
 *
 * @example
 * const users = await get<User[]>('https://api.example.com/users');
 *
 * @example
 * // With query parameters
 * const users = await get<User[]>('https://api.example.com/users', {
 *   params: { page: 1, limit: 10 }
 * });
 */
export async function get<T>(
  url: string,
  options?: Omit<RequestOptions, 'method' | 'body'>
): Promise<HttpResponse<T>> {
  return request<T>(url, { ...options, method: 'GET' })
}

/**
 * Makes a POST request.
 *
 * @example
 * const user = await post<User>('https://api.example.com/users', {
 *   body: { name: 'John', email: 'john@example.com' }
 * });
 */
export async function post<T>(
  url: string,
  options?: RequestOptions
): Promise<HttpResponse<T>> {
  return request<T>(url, { ...options, method: 'POST' })
}

/**
 * Makes a PUT request.
 *
 * @example
 * const user = await put<User>('https://api.example.com/users/1', {
 *   body: { name: 'John Updated' }
 * });
 */
export async function put<T>(
  url: string,
  options?: RequestOptions
): Promise<HttpResponse<T>> {
  return request<T>(url, { ...options, method: 'PUT' })
}

/**
 * Makes a PATCH request.
 *
 * @example
 * const user = await patch<User>('https://api.example.com/users/1', {
 *   body: { name: 'John Updated' }
 * });
 */
export async function patch<T>(
  url: string,
  options?: RequestOptions
): Promise<HttpResponse<T>> {
  return request<T>(url, { ...options, method: 'PATCH' })
}

/**
 * Makes a DELETE request.
 *
 * @example
 * await del('https://api.example.com/users/1');
 */
export async function del<T = void>(
  url: string,
  options?: Omit<RequestOptions, 'body'>
): Promise<HttpResponse<T>> {
  return request<T>(url, { ...options, method: 'DELETE' })
}
