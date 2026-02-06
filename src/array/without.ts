/**
 * Creates an array excluding all given values.
 *
 * @example
 * without([2, 1, 2, 3], 1, 2)
 * // [3]
 */
export function without<T>(array: readonly T[], ...values: T[]): T[] {
  const valuesSet = new Set(values)
  return array.filter((item) => !valuesSet.has(item))
}
