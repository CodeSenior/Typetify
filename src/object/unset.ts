/**
 * Removes a property at a nested path. Returns a new object (immutable).
 *
 * @example
 * unset({ a: { b: 1, c: 2 } }, ['a', 'b']) // { a: { c: 2 } }
 * unset({ a: 1 }, ['b']) // { a: 1 }
 */
export function unset<T extends object>(
  obj: T,
  path: readonly PropertyKey[]
): T {
  if (path.length === 0) return obj

  const head = path[0] as PropertyKey
  const rest = path.slice(1)

  if (rest.length === 0) {
    const result = { ...obj }
    delete (result as Record<PropertyKey, unknown>)[head]
    return result
  }

  const value = (obj as Record<PropertyKey, unknown>)[head]
  if (value === null || value === undefined || typeof value !== 'object') {
    return obj
  }

  return {
    ...obj,
    [head as string]: unset(value as object, rest),
  } as T
}
