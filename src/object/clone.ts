/**
 * Creates a shallow clone of an object.
 *
 * @example
 * const original = { name: 'John', settings: { theme: 'dark' } }
 * const copy = clone(original)
 * copy.name = 'Jane' // doesn't affect original
 * copy.settings.theme = 'light' // DOES affect original (shallow clone)
 */
export function clone<T extends object>(obj: T): T {
  if (Array.isArray(obj)) {
    return [...obj] as unknown as T
  }

  return { ...obj }
}
