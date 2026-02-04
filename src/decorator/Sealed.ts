/**
 * Seals a class, preventing new properties from being added.
 *
 * @example
 * @Sealed()
 * class Config {
 *   readonly apiUrl = 'https://api.example.com'
 * }
 */
export function Sealed(): <T extends new (...args: any[]) => object>(constructor: T) => T {
  return function <T extends new (...args: any[]) => object>(
    constructor: T
  ): T {
    Object.seal(constructor)
    Object.seal(constructor.prototype)
    return constructor
  }
}
