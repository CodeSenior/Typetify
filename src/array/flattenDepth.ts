/**
 * Recursively flattens array up to depth times.
 *
 * @example
 * flattenDepth([1, [2, [3, [4]], 5]], 2)
 * // [1, 2, 3, [4], 5]
 */
export function flattenDepth<T>(
  array: readonly unknown[],
  depth: number = 1
): T[] {
  if (depth <= 0) {
    return array.slice() as T[]
  }

  const result: unknown[] = []

  for (const item of array) {
    if (Array.isArray(item)) {
      result.push(...flattenDepth(item, depth - 1))
    } else {
      result.push(item)
    }
  }

  return result as T[]
}
