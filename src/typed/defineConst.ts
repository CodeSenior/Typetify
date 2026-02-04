/**
 * Creates a readonly constant with inferred literal type.
 * Useful for defining constants that TypeScript will narrow.
 *
 * @example
 * const STATUS = defineConst({
 *   PENDING: 'pending',
 *   ACTIVE: 'active',
 *   DONE: 'done',
 * })
 * // typeof STATUS.PENDING = 'pending' (not string)
 */
export function defineConst<T extends Record<string, unknown>>(
  obj: T
): Readonly<T> {
  return Object.freeze(obj)
}
