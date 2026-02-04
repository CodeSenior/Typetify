/**
 * Checks if a string is a valid URL.
 *
 * @example
 * isUrl('https://example.com') // true
 * isUrl('not-a-url') // false
 */
export function isUrl(str: string): boolean {
  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}
