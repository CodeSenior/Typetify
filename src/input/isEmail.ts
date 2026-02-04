/**
 * Checks if a string is a valid email address.
 *
 * @example
 * isEmail('user@example.com') // true
 * isEmail('invalid-email') // false
 */
export function isEmail(str: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(str)
}
