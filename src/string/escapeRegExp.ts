/**
 * Escapes special RegExp characters in a string.
 * Useful when building dynamic regular expressions from user input.
 *
 * @example
 * // Escape special characters
 * escapeRegExp('[lodash](https://lodash.com/)')
 * // => '\\[lodash\\]\\(https://lodash\\.com/\\)'
 *
 * @example
 * // Safe dynamic regex from user input
 * const userSearch = 'price: $100'
 * const regex = new RegExp(escapeRegExp(userSearch), 'i')
 * regex.test('The price: $100 is final') // => true
 *
 * @example
 * // Highlight search terms safely
 * function highlightText(text: string, search: string) {
 *   const escaped = escapeRegExp(search)
 *   return text.replace(new RegExp(escaped, 'gi'), '<mark>$&</mark>')
 * }
 * highlightText('Hello (world)', '(world)')
 * // => 'Hello <mark>(world)</mark>'
 *
 * @example
 * // Build complex patterns safely
 * const terms = ['C++', 'C#', '.NET']
 * const pattern = terms.map(escapeRegExp).join('|')
 * const regex = new RegExp(pattern, 'g')
 * 'I know C++ and .NET'.match(regex)
 * // => ['C++', '.NET']
 */
export function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}
