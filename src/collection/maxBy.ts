/**
 * Returns the element with the maximum value according to the function.
 *
 * @example
 * maxBy([{ age: 20 }, { age: 30 }, { age: 25 }], u => u.age)
 * // { age: 30 }
 *
 * maxBy([], u => u.age) // undefined
 */
export function maxBy<T>(
  arr: readonly T[],
  fn: (item: T) => number
): T | undefined {
  if (arr.length === 0) return undefined

  let maxItem = arr[0]!
  let maxValue = fn(maxItem)

  for (let i = 1; i < arr.length; i++) {
    const item = arr[i]!
    const value = fn(item)
    if (value > maxValue) {
      maxValue = value
      maxItem = item
    }
  }

  return maxItem
}
