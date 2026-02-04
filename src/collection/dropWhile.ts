/**
 * Drops elements from the beginning of an array while the predicate returns true.
 *
 * @example
 * dropWhile([1, 2, 3, 4, 1], n => n < 3) // [3, 4, 1]
 * dropWhile([5, 1, 2], n => n < 3) // [5, 1, 2]
 */
export function dropWhile<T>(
  arr: readonly T[],
  predicate: (item: T, index: number) => boolean
): T[] {
  let startIndex = 0
  for (let i = 0; i < arr.length; i++) {
    if (!predicate(arr[i]!, i)) {
      startIndex = i
      break
    }
    startIndex = arr.length
  }
  return arr.slice(startIndex)
}
