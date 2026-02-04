/**
 * Returns an array with unique values.
 * Optionally accepts a key function to determine uniqueness.
 *
 * @example
 * unique([1, 2, 2, 3]) // [1, 2, 3]
 * unique([{ id: 1 }, { id: 1 }, { id: 2 }], item => item.id) // [{ id: 1 }, { id: 2 }]
 */
export function unique<T>(array: readonly T[]): T[]
export function unique<T, K>(
  array: readonly T[],
  keyFn: (item: T) => K
): T[]
export function unique<T, K>(
  array: readonly T[],
  keyFn?: (item: T) => K
): T[] {
  if (!keyFn) {
    return [...new Set(array)]
  }

  const seen = new Set<K>()
  const result: T[] = []

  for (const item of array) {
    const key = keyFn(item)
    if (!seen.has(key)) {
      seen.add(key)
      result.push(item)
    }
  }

  return result
}
