/**
 * Advanced conditional types for complex type transformations.
 */

/**
 * If condition is true, return Then, otherwise Else.
 */
export type If<Condition extends boolean, Then, Else> = Condition extends true
  ? Then
  : Else

/**
 * Returns true if T extends U, false otherwise.
 */
export type Extends<T, U> = T extends U ? true : false

/**
 * Returns true if T and U are exactly the same type.
 */
export type Equals<T, U> = (<G>() => G extends T ? 1 : 2) extends <
  G
>() => G extends U ? 1 : 2
  ? true
  : false

/**
 * Returns true if T is `any`.
 */
export type IsAny<T> = 0 extends 1 & T ? true : false

/**
 * Returns true if T is `never`.
 */
export type IsNever<T> = [T] extends [never] ? true : false

/**
 * Returns true if T is `unknown`.
 */
export type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
    ? true
    : false

/**
 * Returns true if T is a union type.
 */
export type IsUnion<T, U = T> = T extends U
  ? [U] extends [T]
    ? false
    : true
  : never

/**
 * Returns true if T is a tuple.
 */
export type IsTuple<T> = T extends readonly unknown[]
  ? number extends T['length']
    ? false
    : true
  : false

/**
 * Returns true if T is a function.
 */
export type IsFunction<T> = T extends (...args: any[]) => any ? true : false

/**
 * Returns true if T is an object (not null, not array, not function).
 */
export type IsObject<T> = T extends object
  ? T extends any[]
    ? false
    : T extends (...args: any[]) => any
      ? false
      : true
  : false

/**
 * Returns true if T is a primitive type.
 */
export type IsPrimitive<T> = T extends
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  ? true
  : false

/**
 * Returns true if T is a literal type (not widened).
 */
export type IsLiteral<T> = T extends string
  ? string extends T
    ? false
    : true
  : T extends number
    ? number extends T
      ? false
      : true
    : T extends boolean
      ? boolean extends T
        ? false
        : true
      : false

/**
 * Returns true if T is nullable (null or undefined).
 */
export type IsNullable<T> = null extends T
  ? true
  : undefined extends T
    ? true
    : false

/**
 * Excludes properties of type U from T.
 */
export type ExcludeByValue<T, U> = {
  [K in keyof T as T[K] extends U ? never : K]: T[K]
}

/**
 * Includes only properties of type U from T.
 */
export type IncludeByValue<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K]
}

/**
 * Makes all properties of T that extend U optional.
 */
export type OptionalByValue<T, U> = Omit<T, keyof IncludeByValue<T, U>> &
  Partial<IncludeByValue<T, U>>

/**
 * Makes all properties of T that extend U required.
 */
export type RequiredByValue<T, U> = Omit<T, keyof IncludeByValue<T, U>> &
  Required<IncludeByValue<T, U>>

/**
 * Switches between types based on a discriminant.
 */
export type Switch<
  T extends string | number,
  Cases extends Record<string | number, unknown>,
  Default = never
> = T extends keyof Cases ? Cases[T] : Default
