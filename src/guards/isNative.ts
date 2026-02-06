/**
 * Checks if value is a native function.
 *
 * @example
 * isNative(Array.prototype.push) // true
 * isNative(() => {}) // false
 */
export function isNative(value: unknown): boolean {
  if (typeof value !== 'function') return false
  const fnStr = Function.prototype.toString.call(value)
  return fnStr.includes('[native code]')
}
