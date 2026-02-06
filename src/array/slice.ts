/**
 * Creates a slice of array from start up to end.
 *
 * @example
 * slice([1, 2, 3, 4], 1, 3)
 * // [2, 3]
 */
export function slice<T>(
  array: readonly T[],
  start: number = 0,
  end: number = array.length
): T[] {
  return array.slice(start, end)
}
