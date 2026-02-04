/**
 * Creates a tuple with inferred literal types.
 * Useful when you need a tuple type without using 'as const'.
 *
 * @example
 * const coords = defineTuple(10, 20, 30)
 * // type: [number, number, number]
 *
 * const status = defineTuple('pending', 'active', 'done')
 * // type: ['pending', 'active', 'done']
 */
export function defineTuple<T extends readonly unknown[]>(
  ...args: T
): T {
  return args
}
