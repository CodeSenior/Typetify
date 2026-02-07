/**
 * Returns elements that do NOT match the predicate.
 * Opposite of filter.
 *
 * @example
 * // Filter out even numbers, keep odd ones
 * reject([1, 2, 3, 4, 5], n => n % 2 === 0)
 * // => [1, 3, 5]
 *
 * @example
 * // Remove inactive users
 * const users = [
 *   { name: 'Alice', active: true },
 *   { name: 'Bob', active: false },
 *   { name: 'Charlie', active: true }
 * ]
 * reject(users, u => u.active)
 * // => [{ name: 'Bob', active: false }]
 *
 * @example
 * // Remove empty strings
 * reject(['hello', '', 'world', ''], s => s === '')
 * // => ['hello', 'world']
 */
export function reject<T>(
  array: readonly T[],
  predicate: (item: T, index: number, array: readonly T[]) => boolean
): T[] {
  return array.filter((item, index, arr) => !predicate(item, index, arr))
}
