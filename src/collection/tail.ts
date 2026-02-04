/**
 * Returns all elements except the first.
 *
 * @example
 * tail([1, 2, 3]) // [2, 3]
 * tail([1]) // []
 * tail([]) // []
 */
export function tail<T>(arr: readonly T[]): T[] {
  return arr.slice(1)
}
