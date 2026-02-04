/**
 * Makes all properties of T optional recursively.
 */
export type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T

/**
 * Makes all properties of T readonly recursively.
 */
export type DeepReadonly<T> = T extends object
  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
  : T

/**
 * Makes all properties of T required recursively.
 */
export type DeepRequired<T> = T extends object
  ? { [P in keyof T]-?: DeepRequired<T[P]> }
  : T

/**
 * Extracts the element type from an array.
 */
export type ElementOf<T> = T extends readonly (infer E)[] ? E : never

/**
 * Makes specified keys required.
 */
export type RequireKeys<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Makes specified keys optional.
 */
export type OptionalKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Extracts keys of T that have values of type V.
 */
export type KeysOfType<T, V> = {
  [K in keyof T]: T[K] extends V ? K : never
}[keyof T]

/**
 * Makes a type mutable (removes readonly).
 */
export type Mutable<T> = {
  -readonly [P in keyof T]: T[P]
}

/**
 * Extracts the resolved type of a Promise.
 */
export type Awaited<T> = T extends Promise<infer U> ? U : T

/**
 * Creates a union of all values in an object.
 */
export type ValueOf<T> = T[keyof T]

/**
 * Excludes null and undefined from T.
 */
export type NonNullableDeep<T> = T extends object
  ? { [P in keyof T]: NonNullableDeep<NonNullable<T[P]>> }
  : NonNullable<T>

/**
 * Makes the type nullable.
 */
export type Nullable<T> = T | null

/**
 * Makes the type optional (can be undefined).
 */
export type Optional<T> = T | undefined

/**
 * Merge two types, with the second type overriding the first.
 */
export type Merge<T, U> = Omit<T, keyof U> & U

/**
 * Require at least one of the specified keys.
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
  }[Keys]

/**
 * Require exactly one of the specified keys.
 */
export type RequireExactlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Exclude<Keys, K>, never>>
  }[Keys]

/**
 * Prettify a type for better IntelliSense display.
 * Flattens intersections into a single object type.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

/**
 * Makes specified keys partial while keeping others required.
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Makes specified keys required while keeping others as-is.
 */
export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

/**
 * Converts a union type to an intersection type.
 */
export type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never

/**
 * Extracts the resolved value type from a Promise.
 */
export type PromiseValue<T> = T extends Promise<infer U> ? U : T

/**
 * Extracts the element type from an array type.
 */
export type ArrayElement<T> = T extends readonly (infer U)[] ? U : never

/**
 * Creates a type that requires all properties to match exactly.
 */
export type Exact<T, Shape> = T extends Shape
  ? Exclude<keyof T, keyof Shape> extends never
    ? T
    : never
  : never

/**
 * Creates a type with all properties set to never.
 */
export type Never<T> = {
  [K in keyof T]?: never
}

/**
 * Extracts function parameter types as a tuple.
 */
export type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never

/**
 * Extracts the return type of a function.
 */
export type ReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => infer R
  ? R
  : any

/**
 * Makes all properties writable (removes readonly) recursively.
 */
export type DeepMutable<T> = T extends object
  ? { -readonly [P in keyof T]: DeepMutable<T[P]> }
  : T

/**
 * Extracts keys that are required in T.
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T]

/**
 * Extracts keys that are optional in T.
 */
export type OptionalKeysOf<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never
}[keyof T]

/**
 * Creates a type where at least one property must be defined.
 */
export type AtLeastOne<T> = {
  [K in keyof T]: Pick<T, K> & Partial<Omit<T, K>>
}[keyof T]

/**
 * Creates a record type with string keys and values of type T.
 */
export type Dictionary<T> = Record<string, T>

/**
 * Creates a readonly record type.
 */
export type ReadonlyDictionary<T> = Readonly<Record<string, T>>
