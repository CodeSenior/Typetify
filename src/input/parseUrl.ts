/**
 * Parses a URL string and returns a URL object, or undefined if invalid.
 *
 * @example
 * parseUrl('https://example.com/path') // URL object
 * parseUrl('not-a-url') // undefined
 */
export function parseUrl(str: string): URL | undefined {
  try {
    return new URL(str)
  } catch {
    return undefined
  }
}
