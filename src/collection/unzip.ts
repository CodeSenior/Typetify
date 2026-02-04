/**
 * Unzips an array of tuples into two arrays.
 *
 * @example
 * unzip([[1, 'a'], [2, 'b'], [3, 'c']])
 * // [[1, 2, 3], ['a', 'b', 'c']]
 */
export function unzip<A, B>(array: readonly (readonly [A, B])[]): [A[], B[]] {
  const a: A[] = []
  const b: B[] = []

  for (const [first, second] of array) {
    a.push(first)
    b.push(second)
  }

  return [a, b]
}
