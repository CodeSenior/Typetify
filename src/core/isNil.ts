/**
 * Checks if a value is null or undefined.
 *
 * @example
 * if (isNil(value)) {
 *   // value is null | undefined
 * }
 */
export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined
}
