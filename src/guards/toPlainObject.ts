/**
 * Converts value to a plain object flattening inherited enumerable string keyed properties.
 *
 * @example
 * function Foo() { this.b = 2 }
 * Foo.prototype.c = 3
 * toPlainObject(new Foo()) // { b: 2, c: 3 }
 */
export function toPlainObject(value: unknown): Record<string, unknown> {
  if (value === null || value === undefined) return {}
  if (typeof value !== 'object') return {}

  const result: Record<string, unknown> = {}

  for (const key in value as object) {
    result[key] = (value as Record<string, unknown>)[key]
  }

  return result
}
