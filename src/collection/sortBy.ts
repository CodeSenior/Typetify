/**
 * Sorts an array by a key function. Returns a new array.
 *
 * @example
 * const users = [{ name: 'Bob' }, { name: 'Alice' }]
 * sortBy(users, user => user.name)
 * // [{ name: 'Alice' }, { name: 'Bob' }]
 */
export function sortBy<T>(
  array: readonly T[],
  keyFn: (item: T) => string | number,
  order: 'asc' | 'desc' = 'asc'
): T[] {
  const sorted = [...array].sort((a, b) => {
    const keyA = keyFn(a)
    const keyB = keyFn(b)

    if (keyA < keyB) return -1
    if (keyA > keyB) return 1
    return 0
  })

  return order === 'desc' ? sorted.reverse() : sorted
}
