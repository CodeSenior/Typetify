/**
 * Like clone but accepts a customizer function.
 *
 * @example
 * cloneWith({ a: 1 }, value => typeof value === 'number' ? value * 2 : undefined)
 * // { a: 2 }
 */
export function cloneWith<T>(
  value: T,
  customizer: (value: unknown) => unknown
): T {
  const result = customizer(value)
  if (result !== undefined) return result as T

  if (value === null || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => {
      const customResult = customizer(item)
      return customResult !== undefined ? customResult : item
    }) as T
  }

  const cloned = {} as T
  for (const key of Object.keys(value)) {
    const val = (value as Record<string, unknown>)[key]
    const customResult = customizer(val)
    ;(cloned as Record<string, unknown>)[key] =
      customResult !== undefined ? customResult : val
  }
  return cloned
}
