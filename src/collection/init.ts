/**
 * Returns all elements except the last.
 *
 * @example
 * init([1, 2, 3]) // [1, 2]
 * init([1]) // []
 * init([]) // []
 */
export function init<T>(arr: readonly T[]): T[] {
  return arr.slice(0, -1)
}
