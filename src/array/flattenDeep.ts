/**
 * Recursively flattens array to a single level.
 *
 * @example
 * flattenDeep([1, [2, [3, [4]], 5]])
 * // [1, 2, 3, 4, 5]
 */
export function flattenDeep<T>(array: readonly unknown[]): T[] {
  const result: T[] = []

  function flatten(arr: readonly unknown[]): void {
    for (const item of arr) {
      if (Array.isArray(item)) {
        flatten(item)
      } else {
        result.push(item as T)
      }
    }
  }

  flatten(array)
  return result
}
