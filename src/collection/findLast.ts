/**
 * Returns the last element in an array that satisfies the predicate.
 *
 * @example
 * findLast([1, 2, 3, 4], n => n % 2 === 0) // 4
 * findLast([1, 3, 5], n => n % 2 === 0) // undefined
 */
export function findLast<T>(
  arr: readonly T[],
  predicate: (item: T, index: number) => boolean
): T | undefined {
  for (let i = arr.length - 1; i >= 0; i--) {
    const item = arr[i]!
    if (predicate(item, i)) return item
  }
  return undefined
}
