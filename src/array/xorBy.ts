/**
 * Like xor, but accepts an iteratee to compare by.
 *
 * @example
 * xorBy([2.1, 1.2], [2.3, 3.4], Math.floor)
 * // [1.2, 3.4]
 */
export function xorBy<T>(
  iteratee: (value: T) => unknown,
  ...arrays: readonly (readonly T[])[]
): T[] {
  const counts = new Map<unknown, { count: number; item: T }>()

  for (const array of arrays) {
    const seen = new Set<unknown>()
    for (const item of array) {
      const computed = iteratee(item)
      if (!seen.has(computed)) {
        seen.add(computed)
        const existing = counts.get(computed)
        if (existing) {
          existing.count++
        } else {
          counts.set(computed, { count: 1, item })
        }
      }
    }
  }

  const result: T[] = []
  for (const { count, item } of counts.values()) {
    if (count === 1) {
      result.push(item)
    }
  }

  return result
}
