/**
 * Like isEqual but accepts a customizer function.
 *
 * @example
 * isEqualWith([1, 2], [1, 2], (a, b) => Array.isArray(a) && Array.isArray(b)) // true
 */
export function isEqualWith(
  value: unknown,
  other: unknown,
  customizer: (value: unknown, other: unknown) => boolean | undefined
): boolean {
  const result = customizer(value, other)
  if (result !== undefined) return result

  if (value === other) return true
  if (value === null || other === null) return value === other
  if (typeof value !== typeof other) return false

  if (typeof value === 'object' && typeof other === 'object') {
    const valueKeys = Object.keys(value as object)
    const otherKeys = Object.keys(other as object)

    if (valueKeys.length !== otherKeys.length) return false

    for (const key of valueKeys) {
      if (
        !isEqualWith(
          (value as Record<string, unknown>)[key],
          (other as Record<string, unknown>)[key],
          customizer
        )
      ) {
        return false
      }
    }
    return true
  }

  return false
}
