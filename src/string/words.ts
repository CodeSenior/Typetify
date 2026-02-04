/**
 * Splits a string into an array of words.
 * Handles camelCase, PascalCase, snake_case, kebab-case, and spaces.
 *
 * @example
 * words('helloWorld') // ['hello', 'World']
 * words('foo-bar_baz') // ['foo', 'bar', 'baz']
 * words('Hello World') // ['Hello', 'World']
 */
export function words(str: string): string[] {
  return str
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
}
