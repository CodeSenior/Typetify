/**
 * Returns a random element from an array.
 *
 * @example
 * sample([1, 2, 3, 4, 5]) // random element
 * sample([]) // undefined
 */
export function sample<T>(array: readonly T[]): T | undefined {
  if (array.length === 0) {
    return undefined
  }

  const index = Math.floor(Math.random() * array.length)
  return array[index]
}
