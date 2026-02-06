/**
 * Checks if value is a TypedArray.
 *
 * @example
 * isTypedArray(new Uint8Array()) // true
 * isTypedArray(new Float32Array()) // true
 * isTypedArray([]) // false
 */
export function isTypedArray(value: unknown): boolean {
  return ArrayBuffer.isView(value) && !(value instanceof DataView)
}
