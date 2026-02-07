/**
 * Converts HTML entities back to their corresponding characters.
 * Inverse of escape().
 *
 * @example
 * // Unescape HTML entities
 * unescape('&lt;script&gt;')
 * // => '<script>'
 *
 * @example
 * // Unescape ampersands
 * unescape('Tom &amp; Jerry')
 * // => 'Tom & Jerry'
 *
 * @example
 * // Unescape quotes
 * unescape('He said &quot;Hello&quot;')
 * // => 'He said "Hello"'
 *
 * @example
 * // Parse escaped content from API
 * const apiResponse = { title: 'Rock &amp; Roll' }
 * unescape(apiResponse.title)
 * // => 'Rock & Roll'
 */
export function unescape(str: string): string {
  const htmlUnescapes: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
  }

  return str.replace(/&(?:amp|lt|gt|quot|#39|#x27|#x2F);/g, (entity) => htmlUnescapes[entity] ?? entity)
}
