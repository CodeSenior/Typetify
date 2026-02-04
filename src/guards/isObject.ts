/**
 * Checks if a value is an object (not null, not an array).
 *
 * @example
 * if (isObject(value)) {
 *   // value is Record<string, unknown>
 * }
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}
