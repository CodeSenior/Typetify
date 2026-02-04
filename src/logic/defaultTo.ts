/**
 * Returns the value if it's not nullish, otherwise returns the default.
 * Replaces: `value ?? defaultValue`
 *
 * @example
 * const timeout = defaultTo(config.timeout, 5000)
 * // Instead of: config.timeout ?? 5000
 */
export function defaultTo<T, D>(
  value: T | null | undefined,
  defaultValue: D
): T | D {
  return value ?? defaultValue
}

/**
 * Lazy version - evaluates default only if needed.
 *
 * @example
 * const user = defaultToLazy(cachedUser, () => fetchUser())
 */
export function defaultToLazy<T, D>(
  value: T | null | undefined,
  getDefault: () => D
): T | D {
  return value ?? getDefault()
}

/**
 * Returns the value if it passes the predicate, otherwise returns the default.
 *
 * @example
 * const validAge = defaultToIf(age, n => n >= 0 && n <= 150, 0)
 */
export function defaultToIf<T, D>(
  value: T,
  predicate: (v: T) => boolean,
  defaultValue: D
): T | D {
  return predicate(value) ? value : defaultValue
}

/**
 * Returns the value if it's not empty (null, undefined, '', [], {}), otherwise returns the default.
 *
 * @example
 * const name = defaultToIfEmpty(user.name, 'Anonymous')
 */
export function defaultToIfEmpty<T, D>(
  value: T | null | undefined,
  defaultValue: D
): T | D {
  if (value === null || value === undefined) return defaultValue
  if (value === '') return defaultValue
  if (Array.isArray(value) && value.length === 0) return defaultValue
  if (typeof value === 'object' && Object.keys(value).length === 0) return defaultValue
  return value
}
