/**
 * Fills elements of array with value from start up to end.
 *
 * @example
 * fill([1, 2, 3], 'a')
 * // ['a', 'a', 'a']
 *
 * fill([4, 6, 8, 10], '*', 1, 3)
 * // [4, '*', '*', 10]
 */
export function fill<T, U>(
  array: T[],
  value: U,
  start: number = 0,
  end: number = array.length
): (T | U)[] {
  const result = [...array] as (T | U)[]
  const startIdx = start < 0 ? Math.max(array.length + start, 0) : start
  const endIdx = end < 0 ? Math.max(array.length + end, 0) : Math.min(end, array.length)

  for (let i = startIdx; i < endIdx; i++) {
    result[i] = value
  }
  return result
}
