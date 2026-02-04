/**
 * Checks if a string is a valid UUID (v1-v5).
 *
 * @example
 * isUuid('550e8400-e29b-41d4-a716-446655440000') // true
 * isUuid('not-a-uuid') // false
 */
export function isUuid(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}
