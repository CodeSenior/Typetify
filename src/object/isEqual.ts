/**
 * Performs a deep equality comparison between two values.
 *
 * @example
 * isEqual({ a: 1 }, { a: 1 }) // true
 * isEqual([1, 2, 3], [1, 2, 3]) // true
 * isEqual({ a: { b: 1 } }, { a: { b: 2 } }) // false
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true

  if (a === null || b === null) return a === b
  if (typeof a !== typeof b) return false

  if (typeof a !== 'object' || typeof b !== 'object') {
    return a === b
  }

  if (Array.isArray(a) !== Array.isArray(b)) return false

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false
    }
    return true
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (a instanceof RegExp && b instanceof RegExp) {
    return a.toString() === b.toString()
  }

  const keysA = Object.keys(a as object)
  const keysB = Object.keys(b as object)

  if (keysA.length !== keysB.length) return false

  for (const key of keysA) {
    if (!keysB.includes(key)) return false
    if (!isEqual((a as any)[key], (b as any)[key])) return false
  }

  return true
}
