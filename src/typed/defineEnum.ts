/**
 * Creates an enum-like object with proper typing.
 * Values are the same as keys.
 *
 * @example
 * const Status = defineEnum(['pending', 'active', 'done'] as const)
 * // Status.pending = 'pending'
 * // type StatusValue = 'pending' | 'active' | 'done'
 */
export function defineEnum<T extends readonly string[]>(
  values: T
): { readonly [K in T[number]]: K } {
  const result = {} as { [K in T[number]]: K }

  for (const value of values) {
    ;(result as Record<string, string>)[value] = value
  }

  return Object.freeze(result)
}

/**
 * Extracts the value type from a defineEnum result.
 *
 * @example
 * const Status = defineEnum(['pending', 'active', 'done'] as const)
 * type StatusValue = EnumValue<typeof Status> // 'pending' | 'active' | 'done'
 */
export type EnumValue<T extends Record<string, string>> = T[keyof T]
