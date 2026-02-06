import { isArrayLike } from './isArrayLike'

/**
 * Checks if value is an array-like object.
 *
 * @example
 * isArrayLikeObject([1, 2, 3]) // true
 * isArrayLikeObject({ length: 0 }) // true
 * isArrayLikeObject('abc') // false (string is not an object)
 */
export function isArrayLikeObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && isArrayLike(value)
}
