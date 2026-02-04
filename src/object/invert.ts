/**
 * Inverts the keys and values of an object.
 * Values must be strings or numbers.
 *
 * @example
 * const roles = { admin: 1, user: 2 }
 * const inverted = invert(roles)
 * // { '1': 'admin', '2': 'user' }
 */
export function invert<T extends Record<string, string | number>>(
  obj: T
): Record<string, keyof T> {
  const result: Record<string, keyof T> = {}

  for (const key of Object.keys(obj)) {
    const value = obj[key]
    if (value !== undefined) {
      result[String(value)] = key
    }
  }

  return result
}
