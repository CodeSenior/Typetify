/**
 * Like isMatch but accepts a customizer function.
 *
 * @example
 * isMatchWith({ a: 1 }, { a: 2 }, (objVal, srcVal) => objVal + 1 === srcVal) // true
 */
export function isMatchWith(
  object: Record<string, unknown>,
  source: Record<string, unknown>,
  customizer: (objValue: unknown, srcValue: unknown, key: string) => boolean | undefined
): boolean {
  for (const key of Object.keys(source)) {
    if (!(key in object)) return false
    
    const objVal = object[key]
    const srcVal = source[key]
    const result = customizer(objVal, srcVal, key)
    
    if (result !== undefined) {
      if (!result) return false
    } else if (objVal !== srcVal) {
      return false
    }
  }
  return true
}
