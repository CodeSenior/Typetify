/**
 * Checks if value is an ArrayBuffer.
 *
 * @example
 * isArrayBuffer(new ArrayBuffer(2)) // true
 * isArrayBuffer(new Array(2)) // false
 */
export function isArrayBuffer(value: unknown): value is ArrayBuffer {
  return value instanceof ArrayBuffer
}
