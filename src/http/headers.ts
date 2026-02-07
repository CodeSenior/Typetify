/**
 * Common HTTP headers.
 */
export const HttpHeaders = {
  ContentType: 'Content-Type',
  Accept: 'Accept',
  Authorization: 'Authorization',
  CacheControl: 'Cache-Control',
  UserAgent: 'User-Agent',
  AcceptLanguage: 'Accept-Language',
  ContentLength: 'Content-Length',
  XRequestId: 'X-Request-Id',
  XForwardedFor: 'X-Forwarded-For',
  XRealIp: 'X-Real-IP',
} as const

/**
 * Common content types.
 */
export const ContentTypes = {
  JSON: 'application/json',
  FormData: 'multipart/form-data',
  FormUrlEncoded: 'application/x-www-form-urlencoded',
  Text: 'text/plain',
  HTML: 'text/html',
  XML: 'application/xml',
  Binary: 'application/octet-stream',
} as const

/**
 * Parses authorization header.
 *
 * @example
 * parseAuthHeader('Bearer token123');
 * // => { type: 'Bearer', credentials: 'token123' }
 *
 * @example
 * parseAuthHeader('Basic dXNlcjpwYXNz');
 * // => { type: 'Basic', credentials: 'dXNlcjpwYXNz' }
 */
export function parseAuthHeader(
  header: string | null
): { type: string; credentials: string } | null {
  if (!header) return null

  const [type, credentials] = header.split(' ')
  if (!type || !credentials) return null

  return { type, credentials }
}

/**
 * Creates a Bearer authorization header.
 *
 * @example
 * bearerAuth('token123');
 * // => 'Bearer token123'
 */
export function bearerAuth(token: string): string {
  return `Bearer ${token}`
}

/**
 * Creates a Basic authorization header.
 *
 * @example
 * basicAuth('user', 'password');
 * // => 'Basic dXNlcjpwYXNzd29yZA=='
 */
export function basicAuth(username: string, password: string): string {
  const credentials = btoa(`${username}:${password}`)
  return `Basic ${credentials}`
}

/**
 * Parses cookies from a Cookie header string.
 *
 * @example
 * parseCookieHeader('session=abc123; user=john');
 * // => { session: 'abc123', user: 'john' }
 */
export function parseCookieHeader(header: string): Record<string, string> {
  const cookies: Record<string, string> = {}

  if (!header) return cookies

  header.split(';').forEach((cookie) => {
    const [name, ...rest] = cookie.trim().split('=')
    if (name) {
      cookies[name] = rest.join('=')
    }
  })

  return cookies
}

/**
 * Builds a Cookie header string from an object.
 *
 * @example
 * buildCookieHeader({ session: 'abc123', user: 'john' });
 * // => 'session=abc123; user=john'
 */
export function buildCookieHeader(cookies: Record<string, string>): string {
  return Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ')
}

/**
 * Merges multiple header objects.
 *
 * @example
 * mergeHeaders(
 *   { 'Content-Type': 'application/json' },
 *   { 'Authorization': 'Bearer token' },
 *   { 'X-Custom': 'value' }
 * );
 * // => { 'Content-Type': 'application/json', 'Authorization': 'Bearer token', 'X-Custom': 'value' }
 */
export function mergeHeaders(
  ...headerObjects: (Record<string, string> | undefined)[]
): Record<string, string> {
  const result: Record<string, string> = {}

  for (const headers of headerObjects) {
    if (headers) {
      Object.assign(result, headers)
    }
  }

  return result
}
