/**
 * Checks if value is likely a DOM element.
 *
 * @example
 * isElement(document.body) // true
 * isElement('<body>') // false
 */
export function isElement(value: unknown): boolean {
  if (typeof Element === 'undefined') return false
  return value instanceof Element
}
