/**
 * Converts a string to kebab-case.
 *
 * @example
 * kebabCase('helloWorld') // 'hello-world'
 * kebabCase('foo_bar') // 'foo-bar'
 * kebabCase('FooBar') // 'foo-bar'
 */
export function kebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}
