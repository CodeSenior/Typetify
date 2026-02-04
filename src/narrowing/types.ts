/**
 * Core types for type narrowing utilities
 */

/**
 * A type guard function that narrows T to S
 */
export type TypeGuard<T, S extends T> = (value: T) => value is S

/**
 * A refinement function that narrows T to S with additional context
 */
export type Refinement<T, S extends T> = (value: T, index: number, array: readonly T[]) => value is S

/**
 * Extracts the narrowed type from a type guard
 */
export type GuardedType<G> = G extends TypeGuard<unknown, infer S> ? S : never

/**
 * Falsy values in JavaScript
 */
export type Falsy = false | 0 | 0n | '' | null | undefined

/**
 * Removes falsy types from a union
 */
export type Truthy<T> = Exclude<T, Falsy>

/**
 * NonNullable but preserves the original type structure
 */
export type Defined<T> = T extends null | undefined ? never : T
