/**
 * Returns elements from the beginning of an array while the predicate returns true.
 *
 * @example
 * takeWhile([1, 2, 3, 4, 1], n => n < 3) // [1, 2]
 * takeWhile([5, 1, 2], n => n < 3) // []
 */
export function takeWhile<T>(
  arr: readonly T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  const result: T[] = []
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i]!
    if (!predicate(item, i)) break
    result.push(item)
  }
  return result
}
