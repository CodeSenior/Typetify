/**
 * Creates a deep clone of an object using structuredClone.
 * Works with most built-in types including Date, Map, Set, ArrayBuffer, etc.
 *
 * @example
 * const original = { name: 'John', settings: { theme: 'dark' } }
 * const copy = cloneDeep(original)
 * copy.settings.theme = 'light' // doesn't affect original
 */
export function cloneDeep<T>(obj: T): T {
  return structuredClone(obj)
}
