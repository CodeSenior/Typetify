/**
 * Like zipObject, but supports property paths.
 *
 * @example
 * zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2])
 * // { a: { b: [{ c: 1 }, { d: 2 }] } }
 */
export function zipObjectDeep(
  keys: readonly string[],
  values: readonly unknown[]
): object {
  const result: Record<string, unknown> = {}

  for (let i = 0; i < keys.length; i++) {
    const path = keys[i]!
    const value = values[i]

    // Parse path into segments
    const segments = path
      .replace(/\[(\d+)\]/g, '.$1')
      .split('.')
      .filter(Boolean)

    let current: Record<string, unknown> = result

    for (let j = 0; j < segments.length - 1; j++) {
      const segment = segments[j]!
      const nextSegment = segments[j + 1]!
      const isNextArray = /^\d+$/.test(nextSegment)

      if (!(segment in current)) {
        current[segment] = isNextArray ? [] : {}
      }

      current = current[segment] as Record<string, unknown>
    }

    const lastSegment = segments[segments.length - 1]!
    current[lastSegment] = value
  }

  return result
}
