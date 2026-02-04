import type { TypeGuard, Refinement } from './types'

/**
 * Filters an array using a type guard with proper type narrowing.
 * 
 * This is the generic solution for filtering with any type guard.
 * 
 * @example
 * const items: unknown[] = [1, 'hello', 2, 'world', null]
 * 
 * const strings = filterByGuard(items, isString)
 * // Type: string[]
 * 
 * const numbers = filterByGuard(items, isNumber)
 * // Type: number[]
 * 
 * @example
 * // With custom type guards
 * interface Admin { role: 'admin'; permissions: string[] }
 * interface User { role: 'user' }
 * type Person = Admin | User
 * 
 * const isAdmin = (p: Person): p is Admin => p.role === 'admin'
 * const admins = filterByGuard(people, isAdmin)
 * // Type: Admin[]
 */
export function filterByGuard<T, S extends T>(
  array: readonly T[],
  guard: TypeGuard<T, S>
): S[] {
  return array.filter(guard)
}

/**
 * Filters with a refinement function that has access to index and array
 */
export function filterByRefinement<T, S extends T>(
  array: readonly T[],
  refinement: Refinement<T, S>
): S[] {
  return array.filter(refinement)
}

/**
 * Creates a filter function from a type guard for use in pipelines
 * 
 * @example
 * pipe(
 *   items,
 *   filterBy(isString),
 *   map(s => s.toUpperCase())
 * )
 */
export function filterBy<T, S extends T>(
  guard: TypeGuard<T, S>
): (array: readonly T[]) => S[] {
  return (array) => filterByGuard(array, guard)
}

/**
 * Partitions an array by a type guard into [matches, nonMatches]
 * 
 * @example
 * const [strings, others] = partitionByGuard(items, isString)
 * // strings: string[]
 * // others: Exclude<typeof items[number], string>[]
 */
export function partitionByGuard<T, S extends T>(
  array: readonly T[],
  guard: TypeGuard<T, S>
): [S[], Exclude<T, S>[]] {
  const matches: S[] = []
  const nonMatches: Exclude<T, S>[] = []
  
  for (const item of array) {
    if (guard(item)) {
      matches.push(item)
    } else {
      nonMatches.push(item as Exclude<T, S>)
    }
  }
  
  return [matches, nonMatches]
}
