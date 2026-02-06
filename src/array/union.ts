/**
 * Creates an array of unique values from all given arrays.
 *
 * @example
 * union([2], [1, 2])
 * // [2, 1]
 */
export function union<T>(...arrays: readonly (readonly T[])[]): T[] {
  const seen = new Set<T>()
  const result: T[] = []

  for (const array of arrays) {
    for (const item of array) {
      if (!seen.has(item)) {
        seen.add(item)
        result.push(item)
      }
    }
  }

  return result
}
