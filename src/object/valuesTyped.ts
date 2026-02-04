/**
 * Returns the values of an object with proper typing.
 * Unlike Object.values(), this returns T[keyof T][] instead of unknown[].
 *
 * @example
 * const user = { id: 1, name: 'John' }
 * const values = valuesTyped(user) // (number | string)[]
 */
export function valuesTyped<T extends object>(obj: T): T[keyof T][] {
  return Object.values(obj) as T[keyof T][]
}
