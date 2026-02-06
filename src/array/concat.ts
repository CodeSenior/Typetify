/**
 * Creates a new array concatenating array with any additional arrays and/or values.
 *
 * @example
 * concat([1], 2, [3], [[4]])
 * // [1, 2, 3, [4]]
 */
export function concat<T>(...args: (T | readonly T[])[]): T[] {
  const result: T[] = []
  for (const arg of args) {
    if (Array.isArray(arg)) {
      result.push(...arg)
    } else {
      result.push(arg as T)
    }
  }
  return result
}
