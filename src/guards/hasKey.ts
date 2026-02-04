/**
 * Checks if an object has a specific key.
 * Narrows the type to include that key.
 *
 * @example
 * const obj: unknown = { name: 'John' }
 * if (hasKey(obj, 'name')) {
 *   console.log(obj.name) // safe access
 * }
 */
export function hasKey<K extends PropertyKey>(
  obj: unknown,
  key: K
): obj is Record<K, unknown> {
  return obj !== null && typeof obj === 'object' && key in obj
}
