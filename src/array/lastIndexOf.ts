/**
 * Gets the index at which the last occurrence of value is found.
 *
 * @example
 * lastIndexOf([1, 2, 1, 2], 2)
 * // 3
 */
export function lastIndexOf<T>(
  array: readonly T[],
  value: T,
  fromIndex: number = array.length - 1
): number {
  const startIndex = fromIndex < 0 ? array.length + fromIndex : Math.min(fromIndex, array.length - 1)
  for (let i = startIndex; i >= 0; i--) {
    if (array[i] === value) {
      return i
    }
  }
  return -1
}
