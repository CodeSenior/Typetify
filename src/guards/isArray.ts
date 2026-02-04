/**
 * Checks if a value is an array.
 * Optionally checks if all elements match a guard function.
 *
 * @example
 * isArray([1, 2, 3]) // true
 * isArray([1, 2, 3], isNumber) // true
 * isArray([1, '2', 3], isNumber) // false
 */
export function isArray(value: unknown): value is unknown[]
export function isArray<T>(
  value: unknown,
  guard: (item: unknown) => item is T
): value is T[]
export function isArray<T>(
  value: unknown,
  guard?: (item: unknown) => item is T
): value is T[] {
  if (!Array.isArray(value)) {
    return false
  }

  if (guard) {
    return value.every(guard)
  }

  return true
}
