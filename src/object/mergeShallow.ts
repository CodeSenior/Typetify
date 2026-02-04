/**
 * Shallow merges two objects. Properties from the second object override the first.
 * Type-safe alternative to Object.assign or spread.
 *
 * @example
 * const defaults = { theme: 'light', lang: 'en' }
 * const user = { theme: 'dark' }
 * const config = mergeShallow(defaults, user)
 * // { theme: 'dark', lang: 'en' }
 */
export function mergeShallow<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  return { ...target, ...source }
}
