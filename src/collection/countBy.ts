/**
 * Creates an object counting occurrences of each key returned by the function.
 *
 * @example
 * countBy([1, 2, 3, 4, 5], n => n % 2 === 0 ? 'even' : 'odd')
 * // { odd: 3, even: 2 }
 *
 * countBy(['one', 'two', 'three'], s => s.length)
 * // { 3: 2, 5: 1 }
 */
export function countBy<T>(
  arr: readonly T[],
  fn: (item: T) => PropertyKey
): Record<PropertyKey, number> {
  const result: Record<PropertyKey, number> = {}
  for (const item of arr) {
    const key = fn(item)
    result[key] = (result[key] ?? 0) + 1
  }
  return result
}
