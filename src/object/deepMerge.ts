/**
 * Deeply merges two objects. Arrays are replaced, not merged.
 * Returns a new object without mutating the originals.
 *
 * @example
 * const a = { user: { name: 'John', age: 30 } }
 * const b = { user: { age: 31, city: 'NYC' } }
 * deepMerge(a, b) // { user: { name: 'John', age: 31, city: 'NYC' } }
 */
export function deepMerge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const result = { ...target } as T & U

  for (const key of Object.keys(source) as (keyof U)[]) {
    const sourceValue = source[key]
    const targetValue = (target as any)[key]

    if (
      isPlainObject(sourceValue) &&
      isPlainObject(targetValue)
    ) {
      (result as any)[key] = deepMerge(targetValue, sourceValue)
    } else {
      (result as any)[key] = sourceValue
    }
  }

  return result
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === null || proto === Object.prototype
}
