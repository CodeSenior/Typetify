/**
 * Checks if a value is a symbol.
 *
 * @example
 * isSymbol(Symbol('test')) // true
 * isSymbol('symbol') // false
 */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol'
}
