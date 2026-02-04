import type { Defined } from './types'

/**
 * Filters an array removing null and undefined values with proper type narrowing.
 * 
 * This solves the pain point where `array.filter(x => x != null)` returns
 * `(T | null | undefined)[]` instead of `T[]`.
 * 
 * @example
 * const users: (User | null | undefined)[] = [user1, null, user2, undefined]
 * const defined = filterDefined(users)
 * // Type: User[] (not (User | null | undefined)[])
 * 
 * @example
 * // Works with complex union types
 * const mixed: (string | number | null)[] = ['a', 1, null, 'b', 2]
 * const result = filterDefined(mixed)
 * // Type: (string | number)[]
 */
export function filterDefined<T>(
  array: readonly (T | null | undefined)[]
): Defined<T>[] {
  return array.filter(
    (item): item is Defined<T> => item !== null && item !== undefined
  )
}

/**
 * Curried version for use in pipelines
 * 
 * @example
 * pipe(
 *   users,
 *   filterDefinedFn(),
 *   map(u => u.name)
 * )
 */
export function filterDefinedFn<T>(): (
  array: readonly (T | null | undefined)[]
) => Defined<T>[] {
  return (array) => filterDefined(array)
}
