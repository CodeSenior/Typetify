/**
 * Returns the entries of an object with proper typing.
 * Unlike Object.entries(), this returns [keyof T, T[keyof T]][] instead of [string, unknown][].
 *
 * @example
 * const user = { id: 1, name: 'John' }
 * for (const [key, value] of entriesTyped(user)) {
 *   // key is 'id' | 'name', value is number | string
 * }
 */
export function entriesTyped<T extends object>(
  obj: T
): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][]
}
