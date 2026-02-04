import type { TypeGuard } from './types'

/**
 * Refines a type by applying multiple type guards in sequence.
 * Each guard further narrows the type.
 * 
 * @example
 * const isPositiveNumber = refine(
 *   isNumber,
 *   (n): n is number => n > 0
 * )
 * 
 * if (isPositiveNumber(value)) {
 *   // value is number and > 0
 * }
 */
export function refine<T, S extends T, R extends S>(
  guard1: TypeGuard<T, S>,
  guard2: TypeGuard<S, R>
): TypeGuard<T, R>
export function refine<T, S extends T, R extends S, Q extends R>(
  guard1: TypeGuard<T, S>,
  guard2: TypeGuard<S, R>,
  guard3: TypeGuard<R, Q>
): TypeGuard<T, Q>
export function refine<T, S extends T>(
  guard1: TypeGuard<T, S>,
  ...guards: Array<(value: S) => boolean>
): TypeGuard<T, S> {
  return ((value: T): value is S => {
    if (!guard1(value)) return false
    for (const guard of guards) {
      if (!guard(value)) return false
    }
    return true
  }) as TypeGuard<T, S>
}

/**
 * Combines multiple type guards with OR logic.
 * Returns true if any guard matches.
 * 
 * @example
 * const isStringOrNumber = oneOf(isString, isNumber)
 * 
 * if (isStringOrNumber(value)) {
 *   // value is string | number
 * }
 */
export function oneOf<T, S1 extends T>(
  guard1: TypeGuard<T, S1>
): TypeGuard<T, S1>
export function oneOf<T, S1 extends T, S2 extends T>(
  guard1: TypeGuard<T, S1>,
  guard2: TypeGuard<T, S2>
): TypeGuard<T, S1 | S2>
export function oneOf<T, S1 extends T, S2 extends T, S3 extends T>(
  guard1: TypeGuard<T, S1>,
  guard2: TypeGuard<T, S2>,
  guard3: TypeGuard<T, S3>
): TypeGuard<T, S1 | S2 | S3>
export function oneOf<T, S1 extends T, S2 extends T, S3 extends T, S4 extends T>(
  guard1: TypeGuard<T, S1>,
  guard2: TypeGuard<T, S2>,
  guard3: TypeGuard<T, S3>,
  guard4: TypeGuard<T, S4>
): TypeGuard<T, S1 | S2 | S3 | S4>
export function oneOf<T, S extends T>(
  ...guards: Array<TypeGuard<T, S>>
): TypeGuard<T, S> {
  return ((value: T): value is S => {
    return guards.some(guard => guard(value))
  }) as TypeGuard<T, S>
}

/**
 * Combines multiple type guards with AND logic.
 * Returns true only if all guards match.
 * 
 * @example
 * const isNonEmptyString = allOf(
 *   isString,
 *   (s): s is string => s.length > 0
 * )
 */
export function allOf<T, S1 extends T>(
  guard1: TypeGuard<T, S1>
): TypeGuard<T, S1>
export function allOf<T, S1 extends T, S2 extends S1>(
  guard1: TypeGuard<T, S1>,
  guard2: TypeGuard<S1, S2>
): TypeGuard<T, S2>
export function allOf<T, S1 extends T, S2 extends S1, S3 extends S2>(
  guard1: TypeGuard<T, S1>,
  guard2: TypeGuard<S1, S2>,
  guard3: TypeGuard<S2, S3>
): TypeGuard<T, S3>
export function allOf<T, S extends T>(
  ...guards: Array<TypeGuard<T, S>>
): TypeGuard<T, S> {
  return ((value: T): value is S => {
    return guards.every(guard => guard(value))
  }) as TypeGuard<T, S>
}

/**
 * Negates a type guard.
 * 
 * @example
 * const isNotNull = not(isNull)
 * const items = array.filter(isNotNull)
 */
export function not<T, S extends T>(
  guard: TypeGuard<T, S>
): TypeGuard<T, Exclude<T, S>> {
  return ((value: T): value is Exclude<T, S> => !guard(value)) as TypeGuard<T, Exclude<T, S>>
}

/**
 * Creates a type guard for array elements.
 * 
 * @example
 * const isStringArray = arrayOf(isString)
 * 
 * if (isStringArray(value)) {
 *   // value is string[]
 * }
 */
export function arrayOf<T, S extends T>(
  guard: TypeGuard<T, S>
): TypeGuard<unknown, S[]> {
  return (value: unknown): value is S[] => {
    return Array.isArray(value) && value.every(guard as TypeGuard<unknown, S>)
  }
}

/**
 * Creates a type guard for objects with specific shape.
 * 
 * @example
 * const isUser = objectOf({
 *   id: isNumber,
 *   name: isString,
 *   email: isString
 * })
 * 
 * if (isUser(data)) {
 *   // data is { id: number; name: string; email: string }
 * }
 */
export function objectOf<T extends Record<string, TypeGuard<unknown, unknown>>>(
  shape: T
): TypeGuard<unknown, { [K in keyof T]: T[K] extends TypeGuard<unknown, infer S> ? S : never }> {
  return (value: unknown): value is { [K in keyof T]: T[K] extends TypeGuard<unknown, infer S> ? S : never } => {
    if (typeof value !== 'object' || value === null) return false
    const obj = value as Record<string, unknown>
    return Object.entries(shape).every(([key, guard]) => guard(obj[key]))
  }
}

/**
 * Creates a type guard for literal values.
 * 
 * @example
 * const isAdmin = literal('admin')
 * const isStatus = oneOf(literal('pending'), literal('done'), literal('error'))
 */
export function literal<T extends string | number | boolean>(
  expected: T
): TypeGuard<unknown, T> {
  return (value: unknown): value is T => value === expected
}

/**
 * Creates a type guard for optional properties.
 * 
 * @example
 * const isOptionalString = optional(isString)
 * // Matches string | undefined
 */
export function optional<T, S extends T>(
  guard: TypeGuard<T, S>
): TypeGuard<T | undefined, S | undefined> {
  return (value: T | undefined): value is S | undefined => {
    return value === undefined || guard(value as T)
  }
}

/**
 * Creates a type guard for nullable properties.
 * 
 * @example
 * const isNullableString = nullable(isString)
 * // Matches string | null
 */
export function nullable<T, S extends T>(
  guard: TypeGuard<T, S>
): TypeGuard<T | null, S | null> {
  return (value: T | null): value is S | null => {
    return value === null || guard(value as T)
  }
}
