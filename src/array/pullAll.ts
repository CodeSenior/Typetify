/**
 * Like pull, but accepts an array of values to remove.
 *
 * @example
 * const array = ['a', 'b', 'c', 'a', 'b', 'c']
 * pullAll(array, ['a', 'c'])
 * // array is now ['b', 'b']
 */
export function pullAll<T>(array: T[], values: readonly T[]): T[] {
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
