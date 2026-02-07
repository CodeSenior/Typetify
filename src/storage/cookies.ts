/**
 * Cookie options for setting cookies.
 */
export interface CookieOptions {
  expires?: Date | number // Date or days
  path?: string
  domain?: string
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

/**
 * Gets a cookie value by name.
 *
 * @example
 * const token = getCookie('auth_token');
 * if (token) {
 *   authenticate(token);
 * }
 *
 * @example
 * // Returns null if not found
 * const missing = getCookie('nonexistent'); // => null
 */
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)

  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() ?? null
  }

  return null
}

/**
 * Sets a cookie with options.
 *
 * @example
 * // Simple cookie
 * setCookie('user_id', '123');
 *
 * @example
 * // With expiration (7 days)
 * setCookie('session', 'abc', { expires: 7 });
 *
 * @example
 * // Secure cookie
 * setCookie('auth_token', token, {
 *   expires: 30,
 *   secure: true,
 *   sameSite: 'Strict',
 *   path: '/'
 * });
 *
 * @example
 * // Session cookie (expires when browser closes)
 * setCookie('temp', 'value');
 */
export function setCookie(name: string, value: string, options: CookieOptions = {}): void {
  if (typeof document === 'undefined') return

  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`

  if (options.expires) {
    const expires =
      typeof options.expires === 'number'
        ? new Date(Date.now() + options.expires * 864e5) // days to ms
        : options.expires

    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (options.path) {
    cookieString += `; path=${options.path}`
  }

  if (options.domain) {
    cookieString += `; domain=${options.domain}`
  }

  if (options.secure) {
    cookieString += '; secure'
  }

  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`
  }

  document.cookie = cookieString
}

/**
 * Removes a cookie by name.
 *
 * @example
 * removeCookie('session');
 *
 * @example
 * // Remove with specific path
 * removeCookie('token', { path: '/admin' });
 */
export function removeCookie(name: string, options: Pick<CookieOptions, 'path' | 'domain'> = {}): void {
  setCookie(name, '', {
    ...options,
    expires: new Date(0),
  })
}

/**
 * Checks if a cookie exists.
 *
 * @example
 * if (hasCookie('auth_token')) {
 *   console.log('User is authenticated');
 * }
 */
export function hasCookie(name: string): boolean {
  return getCookie(name) !== null
}
