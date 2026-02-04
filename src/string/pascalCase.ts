/**
 * Converts a string to PascalCase.
 *
 * @example
 * pascalCase('hello world') // 'HelloWorld'
 * pascalCase('foo-bar') // 'FooBar'
 * pascalCase('fooBar') // 'FooBar'
 */
export function pascalCase(str: string): string {
  return str
    .replace(/[-_\s]+(.)?/g, (_, char) => (char ? char.toUpperCase() : ''))
    .replace(/^[a-z]/, (char) => char.toUpperCase())
}
