/**
 * Creates a slice of array with elements taken from the end while predicate returns true.
 *
 * @example
 * takeRightWhile([1, 2, 3, 4], n => n > 2)
 * // [3, 4]
 */
export function takeRightWhile<T>(
  array: readonly T[],
  predicate: (value: T) => boolean
): T[] {
  let startIndex = array.length

  for (let i = array.length - 1; i >= 0; i--) {
    if (!predicate(array[i]!)) {
      break
    }
    startIndex = i
  }

  return array.slice(startIndex)
}
