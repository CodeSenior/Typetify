/**
 * Removes elements from array at indexes and returns removed elements.
 *
 * @example
 * const array = ['a', 'b', 'c', 'd']
 * const pulled = pullAt(array, 1, 3)
 * // array is now ['a', 'c']
 * // pulled is ['b', 'd']
 */
export function pullAt<T>(array: T[], ...indexes: number[]): T[] {
  const removed: T[] = []
  const indexSet = new Set(indexes.filter((i) => i >= 0 && i < array.length))

  // Collect removed elements in order
  const sortedIndexes = [...indexSet].sort((a, b) => a - b)
  for (const index of sortedIndexes) {
    removed.push(array[index]!)
  }

  // Remove elements from array
  let writeIndex = 0
  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    if (!indexSet.has(readIndex)) {
      array[writeIndex] = array[readIndex]!
      writeIndex++
    }
  }

  array.length = writeIndex
  return removed
}
