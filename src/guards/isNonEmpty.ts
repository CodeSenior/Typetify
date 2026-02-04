import { isEmpty } from './isEmpty'

/**
 * Checks if a value is not empty.
 * Opposite of isEmpty.
 *
 * @example
 * isNonEmpty('hello') // true
 * isNonEmpty([1, 2]) // true
 * isNonEmpty({}) // false
 */
export function isNonEmpty(value: unknown): boolean {
  return !isEmpty(value)
}
