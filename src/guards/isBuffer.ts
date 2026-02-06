/**
 * Checks if value is a Buffer (Node.js).
 *
 * @example
 * isBuffer(Buffer.alloc(2)) // true
 * isBuffer(new Uint8Array(2)) // false
 */
export function isBuffer(value: unknown): boolean {
  if (typeof Buffer === 'undefined') return false
  return Buffer.isBuffer(value)
}
