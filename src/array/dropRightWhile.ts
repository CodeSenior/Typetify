/**
 * Creates a slice of array excluding elements dropped from the end while predicate returns true.
 *
 * @example
 * dropRightWhile([1, 2, 3, 4], n => n > 2)
 * // [1, 2]
 */
export function dropRightWhile<T>(
  array: readonly T[],
  predicate: (value: T) => boolean
): T[] {
  let endIndex = array.length
  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i]!)) {
      endIndex = i + 1
      break
    }
    if (i === 0) {
      endIndex = 0
    }
  }
  return array.slice(0, endIndex)
}
