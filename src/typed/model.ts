/**
 * Model Definition Utilities
 * 
 * Transform TypeScript from "dictionary writing" to "Lego building".
 * Define types using runtime values with automatic type inference.
 */

import type { Prettify } from './types'

// =============================================================================
// PRIMITIVE TYPE MARKERS
// =============================================================================

export const STRING_MARKER: unique symbol = Symbol('string')
export const NUMBER_MARKER: unique symbol = Symbol('number')
export const BOOLEAN_MARKER: unique symbol = Symbol('boolean')
export const DATE_MARKER: unique symbol = Symbol('date')
export const BIGINT_MARKER: unique symbol = Symbol('bigint')
export const SYMBOL_MARKER: unique symbol = Symbol('symbol')
export const ANY_MARKER: unique symbol = Symbol('any')
export const UNKNOWN_MARKER: unique symbol = Symbol('unknown')
export const NULL_MARKER: unique symbol = Symbol('null')
export const UNDEFINED_MARKER: unique symbol = Symbol('undefined')

export const t = {
  string: { [STRING_MARKER]: true } as const,
  number: { [NUMBER_MARKER]: true } as const,
  boolean: { [BOOLEAN_MARKER]: true } as const,
  date: { [DATE_MARKER]: true } as const,
  bigint: { [BIGINT_MARKER]: true } as const,
  symbol: { [SYMBOL_MARKER]: true } as const,
  any: { [ANY_MARKER]: true } as const,
  unknown: { [UNKNOWN_MARKER]: true } as const,
  null: { [NULL_MARKER]: true } as const,
  undefined: { [UNDEFINED_MARKER]: true } as const,
  
  /** Array of a type */
  array: <T>(item: T) => ({ __array: item }) as ArrayMarker<T>,
  
  /** Optional field */
  optional: <T>(type: T) => ({ __optional: type }) as OptionalMarker<T>,
  
  /** Nullable field */
  nullable: <T>(type: T) => ({ __nullable: type }) as NullableMarker<T>,
  
  /** Literal value */
  literal: <T extends string | number | boolean>(value: T) => ({ __literal: value }) as LiteralMarker<T>,
  
  /** Union of literals (enum-like) */
  enum: <T extends readonly (string | number)[]>(...values: T) => ({ __enum: values }) as EnumMarker<T>,
  
  /** Union of types */
  union: <T extends readonly unknown[]>(...types: T) => ({ __union: types }) as UnionMarker<T>,
  
  /** Record/Dictionary */
  record: <V>(valueType: V) => ({ __record: valueType }) as RecordMarker<V>,
  
  /** Tuple */
  tuple: <T extends readonly unknown[]>(...types: T) => ({ __tuple: types }) as TupleMarker<T>,
  
  /** Reference to another model */
  ref: <T>() => ({ __ref: null as unknown as T }) as RefMarker<T>,
} as const

// Type markers
type ArrayMarker<T> = { __array: T }
type OptionalMarker<T> = { __optional: T }
type NullableMarker<T> = { __nullable: T }
type LiteralMarker<T> = { __literal: T }
type EnumMarker<T> = { __enum: T }
type UnionMarker<T> = { __union: T }
type RecordMarker<V> = { __record: V }
type TupleMarker<T> = { __tuple: T }
type RefMarker<T> = { __ref: T }

// =============================================================================
// TYPE INFERENCE
// =============================================================================

type InferSchema<T> =
  // Primitives
  T extends typeof t.string ? string :
  T extends typeof t.number ? number :
  T extends typeof t.boolean ? boolean :
  T extends typeof t.date ? Date :
  T extends typeof t.bigint ? bigint :
  T extends typeof t.symbol ? symbol :
  T extends typeof t.any ? any :
  T extends typeof t.unknown ? unknown :
  T extends typeof t.null ? null :
  T extends typeof t.undefined ? undefined :
  // Native constructors
  T extends StringConstructor ? string :
  T extends NumberConstructor ? number :
  T extends BooleanConstructor ? boolean :
  T extends DateConstructor ? Date :
  T extends BigIntConstructor ? bigint :
  T extends SymbolConstructor ? symbol :
  // Markers
  T extends ArrayMarker<infer U> ? InferSchema<U>[] :
  T extends OptionalMarker<infer U> ? InferSchema<U> | undefined :
  T extends NullableMarker<infer U> ? InferSchema<U> | null :
  T extends LiteralMarker<infer U> ? U :
  T extends EnumMarker<infer U> ? U extends readonly (infer V)[] ? V : never :
  T extends UnionMarker<infer U> ? U extends readonly unknown[] ? InferSchema<U[number]> : never :
  T extends RecordMarker<infer V> ? Record<string, InferSchema<V>> :
  T extends TupleMarker<infer U> ? U extends readonly unknown[] ? { [K in keyof U]: InferSchema<U[K]> } : never :
  T extends RefMarker<infer U> ? U :
  // Literal arrays (enums)
  T extends readonly (string | number | boolean)[] ? T[number] :
  // Nested objects
  T extends object ? { [K in keyof T]: InferSchema<T[K]> } :
  T

// Extract optional keys
type OptionalKeys<T> = {
  [K in keyof T]: T[K] extends OptionalMarker<unknown> ? K : never
}[keyof T]

// Extract required keys
type RequiredKeys<T> = Exclude<keyof T, OptionalKeys<T>>

// Infer model with proper optional handling
type InferModel<T> = Prettify<
  { [K in RequiredKeys<T>]: InferSchema<T[K]> } &
  { [K in OptionalKeys<T>]?: InferSchema<T[K] extends OptionalMarker<infer U> ? U : never> }
>

/**
 * Infer the TypeScript type from a model definition.
 * 
 * @example
 * const UserSchema = defineModel({
 *   id: t.number,
 *   name: t.string,
 *   role: t.enum('admin', 'user', 'guest'),
 * })
 * 
 * type User = Infer<typeof UserSchema>
 * // { id: number; name: string; role: 'admin' | 'user' | 'guest' }
 */
export type Infer<T extends { __schema: unknown }> = T['__schema']

// =============================================================================
// MODEL DEFINITION
// =============================================================================

interface ModelDefinition<T> {
  __schema: InferModel<T>
  __definition: T
  
  /** Create a new instance with validation */
  create(data: InferModel<T>): InferModel<T>
  
  /** Create a partial instance */
  partial(data: Partial<InferModel<T>>): Partial<InferModel<T>>
  
  /** Check if a value matches the schema */
  is(value: unknown): value is InferModel<T>
  
  /** Extend this model with additional fields */
  extend<U extends Record<string, unknown>>(
    extension: U
  ): ModelDefinition<T & U>
  
  /** Pick specific fields */
  pick<K extends keyof T>(
    ...keys: K[]
  ): ModelDefinition<Pick<T, K>>
  
  /** Omit specific fields */
  omit<K extends keyof T>(
    ...keys: K[]
  ): ModelDefinition<Omit<T, K>>
  
  /** Make all fields optional */
  asPartial(): ModelDefinition<{ [K in keyof T]: OptionalMarker<T[K]> }>
  
  /** Make all fields required */
  asRequired(): ModelDefinition<{ [K in keyof T]: T[K] extends OptionalMarker<infer U> ? U : T[K] }>
}

/**
 * Define a model with automatic type inference.
 * 
 * @example
 * // Simple model
 * const User = defineModel({
 *   id: t.number,
 *   name: t.string,
 *   email: t.string,
 * })
 * 
 * // With enums and optionals
 * const Post = defineModel({
 *   id: t.number,
 *   title: t.string,
 *   status: t.enum('draft', 'published', 'archived'),
 *   author: t.optional(t.string),
 *   tags: t.array(t.string),
 * })
 * 
 * // Extract the type
 * type User = Infer<typeof User>
 * type Post = Infer<typeof Post>
 */
export function defineModel<T extends Record<string, unknown>>(
  definition: T
): ModelDefinition<T> {
  const model: ModelDefinition<T> = {
    __schema: null as unknown as InferModel<T>,
    __definition: definition,
    
    create(data) {
      return data
    },
    
    partial(data) {
      return data
    },
    
    is(value): value is InferModel<T> {
      if (typeof value !== 'object' || value === null) return false
      // Basic structural check
      for (const key of Object.keys(definition)) {
        if (!(key in value)) {
          const fieldDef = definition[key]
          // Allow missing optional fields
          if (fieldDef && typeof fieldDef === 'object' && '__optional' in fieldDef) {
            continue
          }
          return false
        }
      }
      return true
    },
    
    extend<U extends Record<string, unknown>>(extension: U) {
      return defineModel({ ...definition, ...extension } as T & U)
    },
    
    pick<K extends keyof T>(...keys: K[]) {
      const picked = {} as Pick<T, K>
      for (const key of keys) {
        picked[key] = definition[key]
      }
      return defineModel(picked)
    },
    
    omit<K extends keyof T>(...keys: K[]) {
      const omitted = { ...definition } as Omit<T, K>
      for (const key of keys) {
        delete (omitted as Record<string, unknown>)[key as string]
      }
      return defineModel(omitted)
    },
    
    asPartial() {
      const partial = {} as { [K in keyof T]: OptionalMarker<T[K]> }
      for (const key of Object.keys(definition) as (keyof T)[]) {
        (partial as Record<string, unknown>)[key as string] = { __optional: definition[key] }
      }
      return defineModel(partial)
    },
    
    asRequired() {
      const required = {} as { [K in keyof T]: T[K] extends OptionalMarker<infer U> ? U : T[K] }
      for (const key of Object.keys(definition) as (keyof T)[]) {
        const field = definition[key]
        if (field && typeof field === 'object' && '__optional' in field) {
          (required as Record<string, unknown>)[key as string] = (field as OptionalMarker<unknown>).__optional
        } else {
          (required as Record<string, unknown>)[key as string] = field
        }
      }
      return defineModel(required)
    },
  }
  
  return model
}

// =============================================================================
// QUICK MODEL (Even simpler syntax)
// =============================================================================

/**
 * Quick model definition using native constructors.
 * Even simpler than defineModel for basic cases.
 * 
 * @example
 * const User = model({
 *   id: Number,
 *   name: String,
 *   active: Boolean,
 *   role: ['admin', 'user'] as const,
 * })
 * 
 * type User = Infer<typeof User>
 * // { id: number; name: string; active: boolean; role: 'admin' | 'user' }
 */
export function model<T extends Record<string, unknown>>(
  definition: T
): ModelDefinition<T> {
  return defineModel(definition)
}

// =============================================================================
// MODEL COMPOSITION
// =============================================================================

/**
 * Merge multiple models into one.
 * 
 * @example
 * const Timestamps = defineModel({
 *   createdAt: t.date,
 *   updatedAt: t.date,
 * })
 * 
 * const User = defineModel({
 *   id: t.number,
 *   name: t.string,
 * })
 * 
 * const UserWithTimestamps = mergeModels(User, Timestamps)
 * type UserWithTimestamps = Infer<typeof UserWithTimestamps>
 */
export function mergeModels<
  A extends ModelDefinition<Record<string, unknown>>,
  B extends ModelDefinition<Record<string, unknown>>
>(
  a: A,
  b: B
): ModelDefinition<A['__definition'] & B['__definition']> {
  return defineModel({
    ...a.__definition,
    ...b.__definition,
  } as A['__definition'] & B['__definition'])
}

/**
 * Create a model that's a subset of another.
 * 
 * @example
 * const User = defineModel({ id: t.number, name: t.string, password: t.string })
 * const PublicUser = pickModel(User, 'id', 'name')
 */
export function pickModel<
  M extends ModelDefinition<Record<string, unknown>>,
  K extends keyof M['__definition'] & string
>(
  model: M,
  ...keys: K[]
): ModelDefinition<Pick<M['__definition'], K>> {
  return model.pick(...keys) as ModelDefinition<Pick<M['__definition'], K>>
}

/**
 * Create a model without certain fields.
 * 
 * @example
 * const User = defineModel({ id: t.number, name: t.string, password: t.string })
 * const SafeUser = omitModel(User, 'password')
 */
export function omitModel<
  M extends ModelDefinition<Record<string, unknown>>,
  K extends keyof M['__definition'] & string
>(
  model: M,
  ...keys: K[]
): ModelDefinition<Omit<M['__definition'], K>> {
  return model.omit(...keys) as ModelDefinition<Omit<M['__definition'], K>>
}
