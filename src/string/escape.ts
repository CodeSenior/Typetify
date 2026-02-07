/**
 * Escapes HTML special characters to prevent XSS attacks.
 * Converts &, <, >, ", and ' to their HTML entity equivalents.
 *
 * @example
 * // Escape user input before rendering
 * escape('<script>alert("xss")</script>')
 * // => '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 *
 * @example
 * // Escape ampersands
 * escape('Tom & Jerry')
 * // => 'Tom &amp; Jerry'
 *
 * @example
 * // Escape quotes in attributes
 * escape('He said "Hello"')
 * // => 'He said &quot;Hello&quot;'
 *
 * @example
 * // Safe to use in innerHTML
 * const userInput = '<img src=x onerror=alert(1)>'
 * element.innerHTML = escape(userInput)
 * // Renders as text, not as HTML
 *
 * @example
 * // Escape single quotes
 * escape("It's a test")
 * // => 'It&#39;s a test'
 */
export function escape(str: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }

  return str.replace(/[&<>"']/g, (char) => htmlEscapes[char] ?? char)
}
