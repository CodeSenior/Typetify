/**
 * Freezes a class, making it completely immutable.
 *
 * @example
 * @Frozen()
 * class Constants {
 *   static readonly PI = 3.14159
 * }
 */
export function Frozen(): <T extends new (...args: any[]) => object>(constructor: T) => T {
  return function <T extends new (...args: any[]) => object>(
    constructor: T
  ): T {
    Object.freeze(constructor)
    Object.freeze(constructor.prototype)
    return constructor
  }
}
