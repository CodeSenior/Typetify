/**
 * Advanced generic type utilities for complex type manipulations.
 */

/**
 * Infers the type of a value at compile time.
 * Useful for creating type-safe factories.
 */
export type Infer<T> = T extends infer U ? U : never

/**
 * Constrains T to extend Constraint, returning T if valid.
 */
export type Constrain<T, Constraint> = T extends Constraint ? T : never

/**
 * Widens a literal type to its base type.
 */
export type Widen<T> = T extends string
  ? string
  : T extends number
    ? number
    : T extends boolean
      ? boolean
      : T extends bigint
        ? bigint
        : T extends symbol
          ? symbol
          : T

/**
 * Narrows a type by excluding null and undefined.
 */
export type Narrow<T> = T extends null | undefined ? never : T

/**
 * Flattens a nested type one level.
 */
export type Flatten<T> = T extends readonly (infer U)[] ? U : T

/**
 * Deeply flattens nested arrays.
 */
export type DeepFlatten<T> = T extends readonly (infer U)[]
  ? DeepFlatten<U>
  : T

/**
 * Gets the first element type of a tuple.
 */
export type Head<T extends readonly unknown[]> = T extends readonly [
  infer H,
  ...unknown[]
]
  ? H
  : never

/**
 * Gets all but the first element type of a tuple.
 */
export type Tail<T extends readonly unknown[]> = T extends readonly [
  unknown,
  ...infer R
]
  ? R
  : never

/**
 * Gets the last element type of a tuple.
 */
export type Last<T extends readonly unknown[]> = T extends readonly [
  ...unknown[],
  infer L
]
  ? L
  : never

/**
 * Gets all but the last element type of a tuple.
 */
export type Init<T extends readonly unknown[]> = T extends readonly [
  ...infer I,
  unknown
]
  ? I
  : never

/**
 * Prepends a type to a tuple.
 */
export type Prepend<T extends readonly unknown[], E> = [E, ...T]

/**
 * Appends a type to a tuple.
 */
export type Append<T extends readonly unknown[], E> = [...T, E]

/**
 * Concatenates two tuples.
 */
export type Concat<
  T extends readonly unknown[],
  U extends readonly unknown[]
> = [...T, ...U]

/**
 * Reverses a tuple type.
 */
export type Reverse<T extends readonly unknown[]> = T extends readonly [
  infer H,
  ...infer R
]
  ? [...Reverse<R>, H]
  : []

/**
 * Gets the length of a tuple.
 */
export type Length<T extends readonly unknown[]> = T['length']

/**
 * Creates a tuple of N elements of type T.
 */
export type Repeat<
  T,
  N extends number,
  R extends unknown[] = []
> = R['length'] extends N ? R : Repeat<T, N, [...R, T]>

/**
 * Takes the first N elements of a tuple.
 */
export type Take<
  T extends readonly unknown[],
  N extends number,
  R extends unknown[] = []
> = R['length'] extends N
  ? R
  : T extends readonly [infer H, ...infer Rest]
    ? Take<Rest, N, [...R, H]>
    : R

/**
 * Drops the first N elements of a tuple.
 */
export type Drop<
  T extends readonly unknown[],
  N extends number,
  C extends unknown[] = []
> = C['length'] extends N
  ? T
  : T extends readonly [unknown, ...infer Rest]
    ? Drop<Rest, N, [...C, unknown]>
    : []

/**
 * Gets the element at index I of a tuple.
 */
export type At<T extends readonly unknown[], I extends number> = T[I]

/**
 * Zips two tuples together.
 */
export type Zip<
  T extends readonly unknown[],
  U extends readonly unknown[]
> = T extends readonly [infer TH, ...infer TR]
  ? U extends readonly [infer UH, ...infer UR]
    ? [[TH, UH], ...Zip<TR, UR>]
    : []
  : []

/**
 * Creates a union from a tuple.
 */
export type TupleToUnion<T extends readonly unknown[]> = T[number]

/**
 * Creates an intersection from a tuple.
 */
export type TupleToIntersection<T extends readonly unknown[]> = T extends readonly [
  infer H,
  ...infer R
]
  ? H & TupleToIntersection<R>
  : unknown

/**
 * Splits a string type by a delimiter.
 */
export type Split<
  S extends string,
  D extends string
> = S extends `${infer H}${D}${infer T}` ? [H, ...Split<T, D>] : [S]

/**
 * Joins a tuple of strings with a delimiter.
 */
export type Join<
  T extends readonly string[],
  D extends string
> = T extends readonly []
  ? ''
  : T extends readonly [infer H extends string]
    ? H
    : T extends readonly [infer H extends string, ...infer R extends string[]]
      ? `${H}${D}${Join<R, D>}`
      : never

/**
 * Replaces all occurrences of From with To in a string type.
 */
export type Replace<
  S extends string,
  From extends string,
  To extends string
> = S extends `${infer H}${From}${infer T}`
  ? `${H}${To}${Replace<T, From, To>}`
  : S

/**
 * Trims whitespace from both ends of a string type.
 */
export type Trim<S extends string> = S extends ` ${infer T}`
  ? Trim<T>
  : S extends `${infer T} `
    ? Trim<T>
    : S
