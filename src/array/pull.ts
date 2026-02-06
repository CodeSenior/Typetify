/**
 * Removes all given values from array (mutates).
 *
 * @example
 * const array = ['a', 'b', 'c', 'a', 'b', 'c']
 * pull(array, 'a', 'c')
 * // array is now ['b', 'b']
 */
export function pull<T>(array: T[], ...values: T[]): T[] {
  const valuesSet = new Set(values)
  let writeIndex = 0

  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    if (!valuesSet.has(array[readIndex]!)) {
      array[writeIndex] = array[readIndex]!
      writeIndex++
    }
  }

  array.length = writeIndex
  return array
}
