/**
 * Converts a string to snake_case.
 *
 * @example
 * snakeCase('helloWorld') // 'hello_world'
 * snakeCase('foo-bar') // 'foo_bar'
 * snakeCase('FooBar') // 'foo_bar'
 */
export function snakeCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase()
}
