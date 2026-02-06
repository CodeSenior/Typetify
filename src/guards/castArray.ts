/**
 * Casts value as an array if it's not one.
 *
 * @example
 * castArray(1) // [1]
 * castArray([1, 2, 3]) // [1, 2, 3]
 * castArray('abc') // ['abc']
 * castArray(null) // [null]
 */
export function castArray<T>(value: T | readonly T[]): T[] {
  if (Array.isArray(value)) {
    return [...value]
  }
  return [value] as T[]
}
