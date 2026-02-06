/**
 * Checks if object conforms to source by invoking the predicate properties of source with the corresponding property values of object.
 *
 * @example
 * const object = { a: 1, b: 2 }
 * conformsTo(object, { a: (n) => n > 0 }) // true
 * conformsTo(object, { b: (n) => n > 5 }) // false
 */
export function conformsTo<T extends Record<string, unknown>>(
  object: T,
  source: { [K in keyof T]?: (value: T[K]) => boolean }
): boolean {
  for (const key of Object.keys(source) as (keyof T)[]) {
    const predicate = source[key]
    if (predicate && !predicate(object[key])) {
      return false
    }
  }
  return true
}
