/**
 * Checks if a nested path exists in an object.
 *
 * @example
 * has({ a: { b: { c: 1 } } }, ['a', 'b', 'c']) // true
 * has({ a: { b: 1 } }, ['a', 'c']) // false
 * has({ a: null }, ['a', 'b']) // false
 */
export function has(obj: unknown, path: readonly PropertyKey[]): boolean {
  if (path.length === 0) return true

  let current: unknown = obj

  for (const key of path) {
    if (current === null || current === undefined) return false
    if (typeof current !== 'object') return false
    if (!(key in (current as object))) return false
    current = (current as Record<PropertyKey, unknown>)[key]
  }

  return true
}
