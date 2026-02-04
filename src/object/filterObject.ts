/**
 * Filters an object's entries based on a predicate function.
 *
 * @example
 * const user = { name: 'John', age: 30, email: null }
 * const defined = filterObject(user, (value) => value !== null)
 * // { name: 'John', age: 30 }
 */
export function filterObject<T extends object>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): Partial<T> {
  const result = {} as Partial<T>

  for (const key of Object.keys(obj) as (keyof T)[]) {
    if (predicate(obj[key], key)) {
      result[key] = obj[key]
    }
  }

  return result
}
