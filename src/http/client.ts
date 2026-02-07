import { request, type RequestOptions, type HttpResponse } from './request'

/**
 * HTTP client configuration.
 */
export interface HttpClientConfig {
  baseUrl: string
  timeout?: number
  headers?: Record<string, string>
  interceptors?: {
    request?: (options: RequestOptions) => RequestOptions | Promise<RequestOptions>
    response?: <T>(response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>
    error?: (error: Error) => Error | Promise<Error>
  }
}

/**
 * HTTP client instance.
 */
export interface HttpClient {
  get: <T>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>) => Promise<HttpResponse<T>>
  post: <T>(url: string, options?: RequestOptions) => Promise<HttpResponse<T>>
  put: <T>(url: string, options?: RequestOptions) => Promise<HttpResponse<T>>
  patch: <T>(url: string, options?: RequestOptions) => Promise<HttpResponse<T>>
  delete: <T = void>(url: string, options?: Omit<RequestOptions, 'body'>) => Promise<HttpResponse<T>>
  request: <T>(url: string, options?: RequestOptions) => Promise<HttpResponse<T>>
}

/**
 * Creates an HTTP client with base configuration.
 *
 * @example
 * const api = createHttpClient({
 *   baseUrl: 'https://api.example.com',
 *   timeout: 5000,
 *   headers: {
 *     'Authorization': 'Bearer token123'
 *   }
 * });
 *
 * // All requests use the base configuration
 * const users = await api.get<User[]>('/users');
 * const user = await api.post<User>('/users', { body: { name: 'John' } });
 *
 * @example
 * // With interceptors
 * const api = createHttpClient({
 *   baseUrl: 'https://api.example.com',
 *   interceptors: {
 *     request: (options) => {
 *       options.headers = {
 *         ...options.headers,
 *         'X-Request-Id': crypto.randomUUID()
 *       };
 *       return options;
 *     },
 *     response: (response) => {
 *       console.log('Response:', response.status);
 *       return response;
 *     },
 *     error: (error) => {
 *       console.error('Request failed:', error);
 *       return error;
 *     }
 *   }
 * });
 */
export function createHttpClient(config: HttpClientConfig): HttpClient {
  const { baseUrl, timeout, headers: defaultHeaders, interceptors } = config

  async function makeRequest<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    url: string,
    options: RequestOptions = {}
  ): Promise<HttpResponse<T>> {
    const finalTimeout = options.timeout ?? timeout
    let mergedOptions: RequestOptions = {
      ...options,
      baseUrl,
      ...(finalTimeout !== undefined && { timeout: finalTimeout }),
      method,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }

    if (interceptors?.request) {
      mergedOptions = await interceptors.request(mergedOptions)
    }

    try {
      let response = await request<T>(url, mergedOptions)

      if (interceptors?.response) {
        response = await interceptors.response(response)
      }

      return response
    } catch (error) {
      if (interceptors?.error && error instanceof Error) {
        throw await interceptors.error(error)
      }
      throw error
    }
  }

  return {
    get: <T>(url: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
      makeRequest<T>('GET', url, options),
    post: <T>(url: string, options?: RequestOptions) =>
      makeRequest<T>('POST', url, options),
    put: <T>(url: string, options?: RequestOptions) =>
      makeRequest<T>('PUT', url, options),
    patch: <T>(url: string, options?: RequestOptions) =>
      makeRequest<T>('PATCH', url, options),
    delete: <T = void>(url: string, options?: Omit<RequestOptions, 'body'>) =>
      makeRequest<T>('DELETE', url, options),
    request: <T>(url: string, options?: RequestOptions) =>
      makeRequest<T>((options?.method as 'GET') ?? 'GET', url, options),
  }
}
