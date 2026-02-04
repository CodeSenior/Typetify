/**
 * Removes null and undefined values from an array.
 * Properly narrows the type.
 *
 * @example
 * compact([1, null, 2, undefined, 3])
 * // [1, 2, 3] with type number[]
 */
export function compact<T>(array: readonly (T | null | undefined)[]): T[] {
  return array.filter((item): item is T => item !== null && item !== undefined)
}
