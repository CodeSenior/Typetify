/**
 * Performs a partial deep comparison to determine if object contains equivalent property values.
 *
 * @example
 * const object = { a: 1, b: 2 }
 * isMatch(object, { a: 1 }) // true
 * isMatch(object, { b: 2 }) // true
 * isMatch(object, { a: 2 }) // false
 */
export function isMatch(
  object: Record<string, unknown>,
  source: Record<string, unknown>
): boolean {
  for (const key of Object.keys(source)) {
    if (!(key in object)) return false
    
    const objVal = object[key]
    const srcVal = source[key]
    
    if (typeof srcVal === 'object' && srcVal !== null && typeof objVal === 'object' && objVal !== null) {
      if (!isMatch(objVal as Record<string, unknown>, srcVal as Record<string, unknown>)) {
        return false
      }
    } else if (objVal !== srcVal) {
      return false
    }
  }
  return true
}
