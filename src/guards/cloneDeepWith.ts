/**
 * Like cloneDeep but accepts a customizer function.
 *
 * @example
 * cloneDeepWith({ a: { b: 1 } }, value => typeof value === 'number' ? value * 2 : undefined)
 * // { a: { b: 2 } }
 */
export function cloneDeepWith<T>(
  value: T,
  customizer: (value: unknown) => unknown
): T {
  const result = customizer(value)
  if (result !== undefined) return result as T

  if (value === null || typeof value !== 'object') {
    return value
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneDeepWith(item, customizer)) as T
  }

  const cloned = {} as T
  for (const key of Object.keys(value)) {
    ;(cloned as Record<string, unknown>)[key] = cloneDeepWith(
      (value as Record<string, unknown>)[key],
      customizer
    )
  }
  return cloned
}
