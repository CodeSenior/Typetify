/**
 * Removes diacritical marks (accents) from a string.
 * Converts Latin-1 Supplement and Latin Extended-A letters to basic Latin letters.
 *
 * @example
 * // Remove French accents
 * deburr('déjà vu')
 * // => 'deja vu'
 *
 * @example
 * // Remove German umlauts
 * deburr('Müller')
 * // => 'Muller'
 *
 * @example
 * // Remove Spanish accents
 * deburr('señor')
 * // => 'senor'
 *
 * @example
 * // Useful for search/filtering
 * const users = ['José', 'François', 'Müller']
 * const search = 'jose'
 * users.filter(name => deburr(name).toLowerCase().includes(search))
 * // => ['José']
 *
 * @example
 * // Create URL-safe slugs
 * deburr('Crème brûlée').toLowerCase().replace(/\s+/g, '-')
 * // => 'creme-brulee'
 */
export function deburr(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}
