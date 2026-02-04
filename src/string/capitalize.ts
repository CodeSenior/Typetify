/**
 * Capitalizes the first letter of a string.
 * Returns the string with proper TypeScript literal type.
 *
 * @example
 * capitalize('hello') // 'Hello'
 * capitalize('WORLD') // 'WORLD'
 */
export function capitalize<T extends string>(str: T): Capitalize<T> {
  if (str.length === 0) return '' as Capitalize<T>
  return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>
}
