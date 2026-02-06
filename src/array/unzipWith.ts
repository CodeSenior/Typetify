/**
 * Like unzip, but accepts an iteratee to combine regrouped values.
 *
 * @example
 * unzipWith([[1, 10, 100], [2, 20, 200]], (...nums) => nums.reduce((a, b) => a + b, 0))
 * // [3, 30, 300]
 */
export function unzipWith<T, R>(
  array: readonly (readonly T[])[],
  iteratee: (...values: T[]) => R
): R[] {
  if (array.length === 0) return []

  const maxLength = Math.max(...array.map((arr) => arr.length))
  const result: R[] = []

  for (let i = 0; i < maxLength; i++) {
    const values = array.map((arr) => arr[i] as T)
    result.push(iteratee(...values))
  }

  return result
}
