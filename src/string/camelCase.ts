/**
 * Converts a string to camelCase.
 *
 * @example
 * camelCase('hello world') // 'helloWorld'
 * camelCase('foo-bar') // 'fooBar'
 * camelCase('FooBar') // 'fooBar'
 */
export function camelCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[A-Z]/, (char) => char.toLowerCase())
}
