/**
 * Logs a deprecation warning. Only logs once per message.
 *
 * @example
 * function oldFunction() {
 *   deprecated('oldFunction is deprecated, use newFunction instead')
 *   // ... old implementation
 * }
 */
const warned = new Set<string>()

export function deprecated(message: string): void {
  if (!warned.has(message)) {
    warned.add(message)
    console.warn(`[DEPRECATED] ${message}`)
  }
}
