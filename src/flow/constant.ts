/**
 * Returns a function that always returns the same value.
 *
 * @example
 * const alwaysTrue = constant(true)
 * alwaysTrue() // true
 * alwaysTrue() // true
 *
 * [1, 2, 3].map(constant('x')) // ['x', 'x', 'x']
 */
export function constant<T>(value: T): () => T {
  return () => value
}
