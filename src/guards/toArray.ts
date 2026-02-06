/**
 * Converts value to an array.
 *
 * @example
 * toArray({ a: 1, b: 2 }) // [1, 2]
 * toArray('abc') // ['a', 'b', 'c']
 * toArray(1) // []
 * toArray(null) // []
 */
export function toArray<T>(value: unknown): T[] {
  if (value === null || value === undefined) return []
  if (Array.isArray(value)) return [...value]
  if (typeof value === 'string') return [...value] as T[]
  if (typeof value === 'object' && value !== null) {
    return Object.values(value) as T[]
  }
  return []
}
