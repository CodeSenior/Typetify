/**
 * Transforms object values using a function.
 *
 * @example
 * transform({ a: 1, b: 2 }, (value, key) => value * 2)
 * // { a: 2, b: 4 }
 */
export function transform<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): Record<keyof T, U> {
  const result = {} as Record<keyof T, U>

  for (const key of Object.keys(obj) as (keyof T)[]) {
    result[key] = fn(obj[key], key)
  }

  return result
}
