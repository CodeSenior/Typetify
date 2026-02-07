/**
 * Creates an object indexed by the key returned by the iteratee.
 * If multiple items have the same key, the last one wins.
 *
 * @example
 * // Index users by their ID
 * const users = [
 *   { id: 'u1', name: 'Alice' },
 *   { id: 'u2', name: 'Bob' },
 *   { id: 'u3', name: 'Charlie' }
 * ]
 * keyBy(users, u => u.id)
 * // => { u1: { id: 'u1', name: 'Alice' }, u2: { id: 'u2', name: 'Bob' }, u3: { id: 'u3', name: 'Charlie' } }
 *
 * @example
 * // Index products by SKU
 * const products = [
 *   { sku: 'ABC123', name: 'Widget', price: 9.99 },
 *   { sku: 'DEF456', name: 'Gadget', price: 19.99 }
 * ]
 * keyBy(products, p => p.sku)
 * // => { ABC123: { sku: 'ABC123', ... }, DEF456: { sku: 'DEF456', ... } }
 *
 * @example
 * // Index by computed key
 * const items = [
 *   { type: 'fruit', name: 'apple' },
 *   { type: 'vegetable', name: 'carrot' }
 * ]
 * keyBy(items, item => `${item.type}-${item.name}`)
 * // => { 'fruit-apple': {...}, 'vegetable-carrot': {...} }
 */
export function keyBy<T>(
  array: readonly T[],
  iteratee: (item: T) => PropertyKey
): Record<PropertyKey, T> {
  const result: Record<PropertyKey, T> = {}

  for (const item of array) {
    const key = iteratee(item)
    result[key] = item
  }

  return result
}
