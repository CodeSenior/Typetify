/**
 * Like pullAll, but accepts an iteratee to compare by.
 *
 * @example
 * const array = [{ x: 1 }, { x: 2 }, { x: 3 }]
 * pullAllBy(array, [{ x: 1 }, { x: 3 }], o => o.x)
 * // array is now [{ x: 2 }]
 */
export function pullAllBy<T>(
  array: T[],
  values: readonly T[],
  iteratee: (value: T) => unknown
): T[] {
  const valuesSet = new Set(values.map(iteratee))
  let writeIndex = 0

  for (let readIndex = 0; readIndex < array.length; readIndex++) {
    if (!valuesSet.has(iteratee(array[readIndex]!))) {
      array[writeIndex] = array[readIndex]!
      writeIndex++
    }
  }

  array.length = writeIndex
  return array
}
