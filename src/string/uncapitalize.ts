/**
 * Uncapitalizes the first letter of a string.
 * Returns the string with proper TypeScript literal type.
 *
 * @example
 * uncapitalize('Hello') // 'hello'
 * uncapitalize('WORLD') // 'wORLD'
 */
export function uncapitalize<T extends string>(str: T): Uncapitalize<T> {
  if (str.length === 0) return '' as Uncapitalize<T>
  return (str.charAt(0).toLowerCase() + str.slice(1)) as Uncapitalize<T>
}
