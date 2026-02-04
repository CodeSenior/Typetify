/**
 * Trims all string values in an object (shallow).
 *
 * @example
 * trimAll({ name: '  John  ', age: 30 })
 * // { name: 'John', age: 30 }
 */
export function trimAll<T extends Record<string, unknown>>(obj: T): T {
  const result = { ...obj }

  for (const key of Object.keys(result)) {
    const value = result[key]
    if (typeof value === 'string') {
      ;(result as Record<string, unknown>)[key] = value.trim()
    }
  }

  return result
}
