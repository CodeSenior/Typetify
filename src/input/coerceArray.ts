/**
 * Coerces a value to an array.
 * - Arrays are returned as-is
 * - null/undefined returns empty array
 * - Other values are wrapped in an array
 *
 * @example
 * coerceArray([1, 2, 3]) // [1, 2, 3]
 * coerceArray('hello') // ['hello']
 * coerceArray(null) // []
 */
export function coerceArray<T>(value: T | readonly T[] | null | undefined): T[] {
  if (value === null || value === undefined) {
    return []
  }

  if (Array.isArray(value)) {
    return [...value]
  }

  return [value as T]
}
