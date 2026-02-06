/**
 * Like zip, but accepts an iteratee to combine grouped values.
 *
 * @example
 * zipWith((a, b, c) => a + b + c, [1, 2], [10, 20], [100, 200])
 * // [111, 222]
 */
export function zipWith<T, R>(
  iteratee: (...values: T[]) => R,
  ...arrays: readonly (readonly T[])[]
): R[] {
  if (arrays.length === 0) return []

  const minLength = Math.min(...arrays.map((arr) => arr.length))
  const result: R[] = []

  for (let i = 0; i < minLength; i++) {
    const values = arrays.map((arr) => arr[i] as T)
    result.push(iteratee(...values))
  }

  return result
}
