/**
 * Truncates a string to a specified length, adding a suffix if truncated.
 *
 * @example
 * truncate('Hello World', 5) // 'Hello...'
 * truncate('Hello World', 5, '…') // 'Hello…'
 * truncate('Hi', 10) // 'Hi'
 */
export function truncate(
  str: string,
  length: number,
  suffix: string = '...'
): string {
  if (str.length <= length) return str
  return str.slice(0, length) + suffix
}
