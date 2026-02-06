/**
 * Creates an array of unique values that is the symmetric difference of the given arrays.
 *
 * @example
 * xor([2, 1], [2, 3])
 * // [1, 3]
 */
export function xor<T>(...arrays: readonly (readonly T[])[]): T[] {
  const counts = new Map<T, number>()

  for (const array of arrays) {
    const seen = new Set<T>()
    for (const item of array) {
      if (!seen.has(item)) {
        seen.add(item)
        counts.set(item, (counts.get(item) ?? 0) + 1)
      }
    }
  }

  const result: T[] = []
  for (const [item, count] of counts) {
    if (count === 1) {
      result.push(item)
    }
  }

  return result
}
