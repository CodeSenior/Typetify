/**
 * Advanced Union and Intersection Type Utilities
 * 
 * These utilities solve the common pain points developers face
 * when working with union and intersection types in TypeScript.
 */

import type { Prettify } from './types'

// =============================================================================
// UNION UTILITIES
// =============================================================================

/**
 * Extracts a specific member from a discriminated union.
 * 
 * @example
 * type Event = 
 *   | { type: 'click'; x: number }
 *   | { type: 'keypress'; key: string }
 * 
 * type ClickEvent = Discriminate<Event, 'type', 'click'>
 * // { type: 'click'; x: number }
 */
export type Discriminate<
  Union,
  Key extends keyof Union,
  Value extends Union[Key]
> = Union extends Record<Key, Value> ? Union : never

/**
 * Excludes a specific member from a discriminated union.
 * 
 * @example
 * type Event = 
 *   | { type: 'click'; x: number }
 *   | { type: 'keypress'; key: string }
 * 
 * type NonClickEvent = ExcludeDiscriminant<Event, 'type', 'click'>
 * // { type: 'keypress'; key: string }
 */
export type ExcludeDiscriminant<
  Union,
  Key extends keyof Union,
  Value extends Union[Key]
> = Union extends Record<Key, Value> ? never : Union

/**
 * Gets all discriminant values from a union type.
 * 
 * @example
 * type Event = { type: 'click' } | { type: 'keypress' } | { type: 'scroll' }
 * type EventTypes = UnionDiscriminants<Event, 'type'>
 * // 'click' | 'keypress' | 'scroll'
 */
export type UnionDiscriminants<Union, Key extends keyof Union> = Union[Key]

/**
 * Converts a union to a tuple type.
 * WARNING: Order is not guaranteed and depends on TypeScript internals.
 * 
 * @example
 * type Colors = 'red' | 'green' | 'blue'
 * type ColorTuple = UnionToTuple<Colors>
 * // ['red', 'green', 'blue'] (order may vary)
 */
export type UnionToTuple<T, L = LastOfUnion<T>, N = [T] extends [never] ? true : false> = 
  true extends N ? [] : [...UnionToTuple<Exclude<T, L>>, L]

type LastOfUnion<T> = UnionToIntersection<
  T extends unknown ? () => T : never
> extends () => infer R ? R : never

type UnionToIntersection<U> = (
  U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void ? I : never

/**
 * Gets the number of members in a union type.
 * 
 * @example
 * type Count = UnionLength<'a' | 'b' | 'c'>
 * // 3
 */
export type UnionLength<T> = UnionToTuple<T>['length']

/**
 * Checks if a union type contains a specific member.
 * 
 * @example
 * type HasRed = UnionContains<'red' | 'green' | 'blue', 'red'>
 * // true
 */
export type UnionContains<Union, Member> = Member extends Union ? true : false

/**
 * Creates a union from an array of literal types.
 * 
 * @example
 * const colors = ['red', 'green', 'blue'] as const
 * type Color = TupleToUnion<typeof colors>
 * // 'red' | 'green' | 'blue'
 */
export type TupleToUnion<T extends readonly unknown[]> = T[number]

/**
 * Distributes a type over a union, applying a transformation.
 * 
 * @example
 * type Boxed = DistributeOver<string | number, { value: T }>
 * // { value: string } | { value: number }
 */
export type DistributeOver<Union, Template> = Union extends unknown
  ? Template extends { __placeholder: infer _ }
    ? never
    : Template
  : never

// =============================================================================
// INTERSECTION UTILITIES
// =============================================================================

/**
 * Safely merges two object types, with the second overriding the first.
 * Prevents the "never" type that occurs when properties conflict.
 * 
 * @example
 * type A = { name: string; age: number }
 * type B = { name: string; email: string }
 * type Merged = SafeMerge<A, B>
 * // { name: string; age: number; email: string }
 */
export type SafeMerge<A, B> = Prettify<Omit<A, keyof B> & B>

/**
 * Deep merge two object types.
 * 
 * @example
 * type A = { user: { name: string } }
 * type B = { user: { age: number } }
 * type Merged = DeepMerge<A, B>
 * // { user: { name: string; age: number } }
 */
export type DeepMerge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? K extends keyof A
      ? A[K] extends object
        ? B[K] extends object
          ? DeepMerge<A[K], B[K]>
          : B[K]
        : B[K]
      : B[K]
    : K extends keyof A
      ? A[K]
      : never
}

/**
 * Merges multiple types in sequence.
 * 
 * @example
 * type Result = MergeAll<[{ a: 1 }, { b: 2 }, { c: 3 }]>
 * // { a: 1; b: 2; c: 3 }
 */
export type MergeAll<T extends readonly object[]> = T extends readonly [infer First, ...infer Rest]
  ? Rest extends readonly object[]
    ? First extends object
      ? SafeMerge<First, MergeAll<Rest>>
      : never
    : First
  : {}

/**
 * Gets the common keys between two types.
 * 
 * @example
 * type A = { a: 1; b: 2; c: 3 }
 * type B = { b: 2; c: 3; d: 4 }
 * type Common = CommonKeys<A, B>
 * // 'b' | 'c'
 */
export type CommonKeys<A, B> = keyof A & keyof B

/**
 * Gets keys that exist in A but not in B.
 * 
 * @example
 * type A = { a: 1; b: 2; c: 3 }
 * type B = { b: 2; c: 3; d: 4 }
 * type Diff = DifferentKeys<A, B>
 * // 'a'
 */
export type DifferentKeys<A, B> = Exclude<keyof A, keyof B>

/**
 * Extracts properties that have the same type in both A and B.
 * 
 * @example
 * type A = { name: string; age: number }
 * type B = { name: string; age: string }
 * type Same = SameTypeKeys<A, B>
 * // 'name'
 */
export type SameTypeKeys<A, B> = {
  [K in CommonKeys<A, B>]: A[K] extends B[K]
    ? B[K] extends A[K]
      ? K
      : never
    : never
}[CommonKeys<A, B>]

/**
 * Detects if an intersection would result in never.
 * Useful for debugging type conflicts.
 * 
 * @example
 * type WouldBeNever = IntersectionIsNever<{ a: string }, { a: number }>
 * // true (because string & number = never)
 */
export type IntersectionIsNever<A, B> = [A & B] extends [never] ? true : false

/**
 * Gets the conflicting keys between two types (same key, different types).
 * 
 * @example
 * type A = { name: string; age: number }
 * type B = { name: string; age: string }
 * type Conflicts = ConflictingKeys<A, B>
 * // 'age'
 */
export type ConflictingKeys<A, B> = Exclude<CommonKeys<A, B>, SameTypeKeys<A, B>>

// =============================================================================
// DISCRIMINATED UNION BUILDERS
// =============================================================================

/**
 * Creates a discriminated union type from a record of variants.
 * 
 * @example
 * type Events = VariantUnion<'type', {
 *   click: { x: number; y: number }
 *   keypress: { key: string }
 *   scroll: { delta: number }
 * }>
 * // | { type: 'click'; x: number; y: number }
 * // | { type: 'keypress'; key: string }
 * // | { type: 'scroll'; delta: number }
 */
export type VariantUnion<
  Discriminant extends string,
  Variants extends Record<string, object>
> = {
  [K in keyof Variants]: Prettify<{ [D in Discriminant]: K } & Variants[K]>
}[keyof Variants]

/**
 * Creates a tagged union (discriminated union with a 'tag' property).
 * 
 * @example
 * type Result = TaggedUnion<{
 *   success: { data: User }
 *   error: { message: string }
 *   loading: {}
 * }>
 * // | { tag: 'success'; data: User }
 * // | { tag: 'error'; message: string }
 * // | { tag: 'loading' }
 */
export type TaggedUnion<Variants extends Record<string, object>> = VariantUnion<'tag', Variants>

/**
 * Creates a typed union (discriminated union with a 'type' property).
 * 
 * @example
 * type Action = TypedUnion<{
 *   increment: { amount: number }
 *   decrement: { amount: number }
 *   reset: {}
 * }>
 * // | { type: 'increment'; amount: number }
 * // | { type: 'decrement'; amount: number }
 * // | { type: 'reset' }
 */
export type TypedUnion<Variants extends Record<string, object>> = VariantUnion<'type', Variants>

// =============================================================================
// NARROWING HELPERS
// =============================================================================

/**
 * Narrows a union type to a specific subset.
 * 
 * @example
 * type Status = 'pending' | 'success' | 'error' | 'cancelled'
 * type ActiveStatus = NarrowUnion<Status, 'pending' | 'success'>
 * // 'pending' | 'success'
 */
export type NarrowUnion<Union, Subset extends Union> = Subset

/**
 * Widens a literal type to its base type.
 * 
 * @example
 * type Widened = Widen<'hello'>
 * // string
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
 * Extracts the non-nullable members of a union.
 * 
 * @example
 * type NonNull = NonNullableUnion<string | null | undefined | number>
 * // string | number
 */
export type NonNullableUnion<T> = T extends null | undefined ? never : T

/**
 * Extracts only the object types from a union.
 * 
 * @example
 * type Objects = ExtractObjects<string | { a: 1 } | number | { b: 2 }>
 * // { a: 1 } | { b: 2 }
 */
export type ExtractObjects<T> = T extends object
  ? T extends readonly unknown[]
    ? never
    : T extends (...args: unknown[]) => unknown
      ? never
      : T
  : never

/**
 * Extracts only the primitive types from a union.
 * 
 * @example
 * type Primitives = ExtractPrimitives<string | { a: 1 } | number | null>
 * // string | number | null
 */
export type ExtractPrimitives<T> = T extends string | number | boolean | bigint | symbol | null | undefined
  ? T
  : never
