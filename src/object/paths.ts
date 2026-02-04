/**
 * Returns all paths in an object as arrays of keys.
 *
 * @example
 * paths({ a: 1, b: { c: 2, d: 3 } })
 * // [['a'], ['b', 'c'], ['b', 'd']]
 */
export function paths(obj: object): PropertyKey[][] {
  const result: PropertyKey[][] = []

  function traverse(current: unknown, path: PropertyKey[]): void {
    if (current === null || typeof current !== 'object') {
      if (path.length > 0) {
        result.push(path)
      }
      return
    }

    if (Array.isArray(current)) {
      if (current.length === 0) {
        result.push(path)
      } else {
        current.forEach((item, index) => {
          traverse(item, [...path, index])
        })
      }
      return
    }

    const keys = Object.keys(current)
    if (keys.length === 0) {
      result.push(path)
    } else {
      for (const key of keys) {
        traverse((current as Record<string, unknown>)[key], [...path, key])
      }
    }
  }

  traverse(obj, [])
  return result
}
