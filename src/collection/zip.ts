/**
 * Zips two arrays together into an array of tuples.
 * Stops at the shorter array.
 *
 * @example
 * zip([1, 2, 3], ['a', 'b', 'c'])
 * // [[1, 'a'], [2, 'b'], [3, 'c']]
 */
export function zip<A, B>(a: readonly A[], b: readonly B[]): [A, B][] {
  const length = Math.min(a.length, b.length)
  const result: [A, B][] = []

  for (let i = 0; i < length; i++) {
    result.push([a[i]!, b[i]!])
  }

  return result
}
