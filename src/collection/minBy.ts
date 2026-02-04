/**
 * Returns the element with the minimum value according to the function.
 *
 * @example
 * minBy([{ age: 20 }, { age: 30 }, { age: 25 }], u => u.age)
 * // { age: 20 }
 *
 * minBy([], u => u.age) // undefined
 */
export function minBy<T>(
  arr: readonly T[],
  fn: (item: T) => number
): T | undefined {
  if (arr.length === 0) return undefined

  let minItem = arr[0]!
  let minValue = fn(minItem)

  for (let i = 1; i < arr.length; i++) {
    const item = arr[i]!
    const value = fn(item)
    if (value < minValue) {
      minValue = value
      minItem = item
    }
  }

  return minItem
}
