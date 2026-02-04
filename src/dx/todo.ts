/**
 * Marks a code path as not yet implemented.
 * Throws an error at runtime if reached.
 *
 * @example
 * function processPayment(method: PaymentMethod) {
 *   if (method === 'card') {
 *     return processCard()
 *   }
 *   todo('Implement other payment methods')
 * }
 */
export function todo(message: string = 'Not implemented'): never {
  throw new Error(`TODO: ${message}`)
}
