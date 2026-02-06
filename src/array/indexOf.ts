/**
 * Gets the index at which the first occurrence of value is found.
 *
 * @example
 * indexOf([1, 2, 1, 2], 2) // 1
 * indexOf([1, 2, 1, 2], 2, 2) // 3
 */
export function indexOf<T>(
  array: readonly T[],
  value: T,
  fromIndex: number = 0
): number {
  const startIndex = fromIndex < 0 ? Math.max(array.length + fromIndex, 0) : fromIndex
  for (let i = startIndex; i < array.length; i++) {
    if (array[i] === value) {
      return i
    }
  }
  return -1
}
