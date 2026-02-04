/**
 * Flattens an array one level deep.
 *
 * @example
 * flatten([[1, 2], [3, 4], [5]])
 * // [1, 2, 3, 4, 5]
 */
export function flatten<T>(array: readonly (T | readonly T[])[]): T[] {
  const result: T[] = []

  for (const item of array) {
    if (Array.isArray(item)) {
      result.push(...item)
    } else {
      result.push(item as T)
    }
  }

  return result
}
