/**
 * Maps over the values of an object, returning a new object with the same keys.
 *
 * @example
 * const prices = { apple: 1, banana: 2 }
 * const doubled = mapObject(prices, (value) => value * 2)
 * // { apple: 2, banana: 4 }
 */
export function mapObject<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): { [K in keyof T]: U } {
  const result = {} as { [K in keyof T]: U }

  for (const key of Object.keys(obj) as (keyof T)[]) {
    result[key] = fn(obj[key], key)
  }

  return result
}
