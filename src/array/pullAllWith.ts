/**
 * Like pullAll, but accepts a comparator function.
 *
 * @example
 * const array = [{ x: 1, y: 2 }, { x: 3, y: 4 }]
 * pullAllWith(array, [{ x: 3, y: 4 }], isEqual)
 * // array is now [{ x: 1, y: 2 }]
 */
export function pullAllWith<T>(
  array: T[],
  values: readonly T[],
  comparator: (a: T, b: T) => boolean
): T[] {
  let writeIndex = 0

  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    const shouldRemove = values.some((value) =>
      comparator(array[readIndex]!, value)
    )
    if (!shouldRemove) {
      array[writeIndex] = array[readIndex]!
      writeIndex++
    }
  }

  array.length = writeIndex
  return array
}
