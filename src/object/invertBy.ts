/**
 * Inverts the keys and values of an object, grouping keys by their values.
 * Unlike invert(), this handles duplicate values by creating arrays.
 *
 * @example
 * // Group by value
 * const roles = { alice: 'admin', bob: 'user', charlie: 'admin' }
 * invertBy(roles)
 * // => { admin: ['alice', 'charlie'], user: ['bob'] }
 *
 * @example
 * // Group users by age
 * const ages = { john: 30, jane: 25, bob: 30, alice: 25 }
 * invertBy(ages)
 * // => { '25': ['jane', 'alice'], '30': ['john', 'bob'] }
 *
 * @example
 * // With custom iteratee
 * const scores = { alice: 85, bob: 92, charlie: 78, diana: 95 }
 * invertBy(scores, score => score >= 90 ? 'A' : score >= 80 ? 'B' : 'C')
 * // => { B: ['alice'], A: ['bob', 'diana'], C: ['charlie'] }
 *
 * @example
 * // Group products by category
 * const products = {
 *   widget: 'electronics',
 *   gadget: 'electronics',
 *   chair: 'furniture',
 *   desk: 'furniture'
 * }
 * invertBy(products)
 * // => { electronics: ['widget', 'gadget'], furniture: ['chair', 'desk'] }
 */
export function invertBy<T extends Record<string, unknown>>(
  obj: T,
  iteratee?: (value: T[keyof T]) => PropertyKey
): Record<PropertyKey, string[]> {
  const result: Record<PropertyKey, string[]> = {}

  for (const key of Object.keys(obj)) {
    const value = obj[key] as T[keyof T]
    const groupKey = iteratee ? iteratee(value) : String(value)

    if (!result[groupKey]) {
      result[groupKey] = []
    }
    result[groupKey].push(key)
  }

  return result
}
