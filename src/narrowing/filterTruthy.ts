import type { Truthy } from './types'

/**
 * Filters an array removing all falsy values with proper type narrowing.
 * 
 * Removes: false, 0, 0n, '', null, undefined
 * 
 * @example
 * const values: (string | number | null | undefined | false)[] = 
 *   ['hello', 0, '', null, 'world', false, 42]
 * 
 * const truthy = filterTruthy(values)
 * // Type: (string | number)[]
 * // Value: ['hello', 'world', 42]
 * 
 * @example
 * // Useful for conditional rendering arrays
 * const items = filterTruthy([
 *   showHeader && <Header />,
 *   <Content />,
 *   showFooter && <Footer />
 * ])
 */
export function filterTruthy<T>(array: readonly T[]): Truthy<T>[] {
  return array.filter((item): item is Truthy<T> => Boolean(item))
}

/**
 * Curried version for use in pipelines
 */
export function filterTruthyFn<T>(): (array: readonly T[]) => Truthy<T>[] {
  return (array) => filterTruthy(array)
}
