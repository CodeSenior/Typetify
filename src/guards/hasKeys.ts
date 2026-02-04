/**
 * Checks if an object has all specified keys.
 * Narrows the type to include those keys.
 *
 * @example
 * const obj: unknown = { name: 'John', age: 30 }
 * if (hasKeys(obj, ['name', 'age'])) {
 *   console.log(obj.name, obj.age) // safe access
 * }
 */
export function hasKeys<K extends PropertyKey>(
  obj: unknown,
  keys: readonly K[]
): obj is Record<K, unknown> {
  if (obj === null || typeof obj !== 'object') {
    return false
  }

  return keys.every((key) => key in obj)
}
