/**
 * Sets a nested property on an object, creating intermediate objects as needed.
 * Returns a new object (immutable).
 *
 * @example
 * const user = { profile: { name: 'John' } }
 * const updated = set(user, ['profile', 'age'], 30)
 * // { profile: { name: 'John', age: 30 } }
 */
export function set<T extends object>(
  obj: T,
  path: readonly PropertyKey[],
  value: unknown
): T {
  if (path.length === 0) {
    return value as T
  }

  const [head, ...rest] = path

  if (head === undefined) {
    return obj
  }

  const currentValue = (obj as Record<PropertyKey, unknown>)[head]

  const newValue =
    rest.length === 0
      ? value
      : set(
          (typeof currentValue === 'object' && currentValue !== null
            ? currentValue
            : {}) as object,
          rest,
          value
        )

  if (Array.isArray(obj)) {
    const result = [...obj] as unknown as T
    ;(result as Record<PropertyKey, unknown>)[head] = newValue
    return result
  }

  return {
    ...obj,
    [head]: newValue,
  }
}
