/**
 * Removes all elements from array that predicate returns truthy for.
 *
 * @example
 * const array = [1, 2, 3, 4]
 * const evens = remove(array, n => n % 2 === 0)
 * // array is now [1, 3]
 * // evens is [2, 4]
 */
export function remove<T>(
  array: T[],
  predicate: (value: T) => boolean
): T[] {
  const removed: T[] = []
  let writeIndex = 0

  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    const item = array[readIndex]!
    if (predicate(item)) {
      removed.push(item)
    } else {
      array[writeIndex] = item
      writeIndex++
    }
  }

  array.length = writeIndex
  return removed
}
