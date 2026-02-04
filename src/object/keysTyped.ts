/**
 * Returns the keys of an object with proper typing.
 * Unlike Object.keys(), this returns (keyof T)[] instead of string[].
 *
 * @example
 * const user = { id: 1, name: 'John' }
 * const keys = keysTyped(user) // ('id' | 'name')[]
 */
export function keysTyped<T extends object>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[]
}
