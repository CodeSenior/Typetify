/**
 * Calls a method on an object only if the object exists.
 * Replaces: `obj?.method(args)`
 *
 * @example
 * optional(user, u => u.getName())
 * optional(array, a => a.map(x => x * 2))
 *
 * // Instead of:
 * user?.getName()
 * array?.map(x => x * 2)
 */
export function optional<T, R>(
  value: T | null | undefined,
  fn: (v: T) => R
): R | undefined {
  if (value === null || value === undefined) {
    return undefined
  }
  return fn(value)
}

/**
 * Calls a method with a default value if the object doesn't exist.
 *
 * @example
 * const length = optionalOr(str, s => s.length, 0)
 * // Instead of: str?.length ?? 0
 */
export function optionalOr<T, R, D>(
  value: T | null | undefined,
  fn: (v: T) => R,
  defaultValue: D
): R | D {
  if (value === null || value === undefined) {
    return defaultValue
  }
  return fn(value)
}

/**
 * Applies multiple optional operations in sequence.
 *
 * @example
 * const result = optionalChain(
 *   user,
 *   u => u.profile,
 *   p => p.settings,
 *   s => s.theme
 * )
 * // Instead of: user?.profile?.settings?.theme
 */
export function optionalChain<T, A>(
  value: T | null | undefined,
  fn1: (v: T) => A | null | undefined
): A | undefined
export function optionalChain<T, A, B>(
  value: T | null | undefined,
  fn1: (v: T) => A | null | undefined,
  fn2: (v: A) => B | null | undefined
): B | undefined
export function optionalChain<T, A, B, C>(
  value: T | null | undefined,
  fn1: (v: T) => A | null | undefined,
  fn2: (v: A) => B | null | undefined,
  fn3: (v: B) => C | null | undefined
): C | undefined
export function optionalChain<T, A, B, C, D>(
  value: T | null | undefined,
  fn1: (v: T) => A | null | undefined,
  fn2: (v: A) => B | null | undefined,
  fn3: (v: B) => C | null | undefined,
  fn4: (v: C) => D | null | undefined
): D | undefined
export function optionalChain(
  value: unknown,
  ...fns: readonly ((v: unknown) => unknown)[]
): unknown {
  let current = value
  for (const fn of fns) {
    if (current === null || current === undefined) {
      return undefined
    }
    current = fn(current)
  }
  return current ?? undefined
}
