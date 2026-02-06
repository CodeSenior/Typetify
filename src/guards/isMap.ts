/**
 * Checks if value is a Map.
 *
 * @example
 * isMap(new Map()) // true
 * isMap(new WeakMap()) // false
 * isMap({}) // false
 */
export function isMap(value: unknown): value is Map<unknown, unknown> {
  return value instanceof Map
}
