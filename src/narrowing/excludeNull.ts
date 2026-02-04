/**
 * Excludes null from a value's type at runtime and compile time.
 * Throws if the value is null.
 * 
 * @example
 * const element: HTMLElement | null = document.getElementById('app')
 * const el = excludeNull(element, 'App element not found')
 * // el is HTMLElement
 */
export function excludeNull<T>(
  value: T | null,
  message?: string
): T {
  if (value === null) {
    throw new Error(message ?? 'Unexpected null value')
  }
  return value
}

/**
 * Excludes undefined from a value's type at runtime and compile time.
 * Throws if the value is undefined.
 */
export function excludeUndefined<T>(
  value: T | undefined,
  message?: string
): T {
  if (value === undefined) {
    throw new Error(message ?? 'Unexpected undefined value')
  }
  return value
}

/**
 * Excludes null and undefined from a value's type.
 * Throws if the value is null or undefined.
 */
export function excludeNullish<T>(
  value: T | null | undefined,
  message?: string
): T {
  if (value === null || value === undefined) {
    throw new Error(message ?? 'Unexpected null or undefined value')
  }
  return value
}

/**
 * Returns the value if defined, otherwise returns the default.
 * Type-safe alternative to the nullish coalescing operator with better inference.
 * 
 * @example
 * const config: Config | undefined = loadConfig()
 * const safeConfig = withDefault(config, defaultConfig)
 * // safeConfig is Config (not Config | undefined)
 */
export function withDefault<T>(
  value: T | null | undefined,
  defaultValue: T
): T {
  return value ?? defaultValue
}

/**
 * Returns the value if defined, otherwise calls the factory function.
 * Useful when the default value is expensive to compute.
 * 
 * @example
 * const cached = withDefaultLazy(cache.get(key), () => computeExpensiveValue())
 */
export function withDefaultLazy<T>(
  value: T | null | undefined,
  factory: () => T
): T {
  return value ?? factory()
}

/**
 * Maps a nullable value, returning null/undefined if the input is null/undefined.
 * 
 * @example
 * const user: User | null = findUser(id)
 * const name = mapNullable(user, u => u.name)
 * // name is string | null
 */
export function mapNullable<T, U>(
  value: T | null | undefined,
  fn: (value: T) => U
): U | null | undefined {
  if (value === null) return null
  if (value === undefined) return undefined
  return fn(value)
}

/**
 * Chains nullable operations, similar to optional chaining but with functions.
 * 
 * @example
 * const result = chainNullable(
 *   user,
 *   u => u.profile,
 *   p => p.settings,
 *   s => s.theme
 * )
 * // result is Theme | null | undefined
 */
export function chainNullable<T, A>(
  value: T | null | undefined,
  fn1: (v: T) => A | null | undefined
): A | null | undefined
export function chainNullable<T, A, B>(
  value: T | null | undefined,
  fn1: (v: T) => A | null | undefined,
  fn2: (v: A) => B | null | undefined
): B | null | undefined
export function chainNullable<T, A, B, C>(
  value: T | null | undefined,
  fn1: (v: T) => A | null | undefined,
  fn2: (v: A) => B | null | undefined,
  fn3: (v: B) => C | null | undefined
): C | null | undefined
export function chainNullable<T, A, B, C, D>(
  value: T | null | undefined,
  fn1: (v: T) => A | null | undefined,
  fn2: (v: A) => B | null | undefined,
  fn3: (v: B) => C | null | undefined,
  fn4: (v: C) => D | null | undefined
): D | null | undefined
export function chainNullable(
  value: unknown,
  ...fns: Array<(v: unknown) => unknown>
): unknown {
  let result = value
  for (const fn of fns) {
    if (result === null || result === undefined) {
      return result
    }
    result = fn(result)
  }
  return result
}
