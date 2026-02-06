/**
 * Checks if value is likely an arguments object.
 *
 * @example
 * function test() { return isArguments(arguments) }
 * test() // true
 * isArguments([1, 2, 3]) // false
 */
export function isArguments(value: unknown): boolean {
  return Object.prototype.toString.call(value) === '[object Arguments]'
}
