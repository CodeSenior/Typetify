/**
 * Converts all elements in array into a string separated by separator.
 *
 * @example
 * join(['a', 'b', 'c'], '~')
 * // 'a~b~c'
 */
export function join<T>(array: readonly T[], separator: string = ','): string {
  return array.join(separator)
}
