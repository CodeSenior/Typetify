/**
 * Type-Safe Merge Utilities
 * 
 * These functions solve the common problem of merging objects
 * while preserving proper type inference.
 */

import type { Prettify } from './types'

/**
 * Type for deep merge result.
 */
type DeepMergeResult<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? K extends keyof A
      ? A[K] extends object
        ? B[K] extends object
          ? A[K] extends readonly unknown[]
            ? B[K]
            : B[K] extends readonly unknown[]
              ? B[K]
              : DeepMergeResult<A[K], B[K]>
          : B[K]
        : B[K]
      : B[K]
    : K extends keyof A
      ? A[K]
      : never
}

/**
 * Merges two objects with proper type inference.
 * The second object's properties override the first.
 * 
 * Unlike `{ ...a, ...b }`, this preserves exact types.
 * 
 * @example
 * const base = { name: 'John', age: 30 }
 * const override = { age: 31, email: 'john@example.com' }
 * 
 * const merged = merge(base, override)
 * // Type: { name: string; age: number; email: string }
 * // Value: { name: 'John', age: 31, email: 'john@example.com' }
 */
export function merge<A extends object, B extends object>(
  a: A,
  b: B
): Prettify<Omit<A, keyof B> & B> {
  return { ...a, ...b } as Prettify<Omit<A, keyof B> & B>
}

/**
 * Merges multiple objects in sequence.
 * Later objects override earlier ones.
 * 
 * @example
 * const result = mergeAll(
 *   { a: 1 },
 *   { b: 2 },
 *   { c: 3, a: 10 }
 * )
 * // Type: { a: number; b: number; c: number }
 * // Value: { a: 10, b: 2, c: 3 }
 */
export function mergeAll<T extends object[]>(
  ...objects: T
): MergeAllResult<T> {
  return Object.assign({}, ...objects) as MergeAllResult<T>
}

type MergeAllResult<T extends object[]> = T extends [infer First, ...infer Rest]
  ? Rest extends object[]
    ? First extends object
      ? Prettify<Omit<First, keyof MergeAllResult<Rest>> & MergeAllResult<Rest>>
      : never
    : First
  : {}

/**
 * Deep merges two objects, recursively merging nested objects.
 * 
 * @example
 * const base = {
 *   user: { name: 'John', settings: { theme: 'light' } }
 * }
 * const override = {
 *   user: { settings: { notifications: true } }
 * }
 * 
 * const merged = deepMerge(base, override)
 * // {
 * //   user: {
 * //     name: 'John',
 * //     settings: { theme: 'light', notifications: true }
 * //   }
 * // }
 */
export function deepMerge<A extends object, B extends object>(
  a: A,
  b: B
): Prettify<DeepMergeResult<A, B>> {
  const result = { ...a } as Record<string, unknown>

  for (const key of Object.keys(b)) {
    const bValue = (b as Record<string, unknown>)[key]
    const aValue = (a as Record<string, unknown>)[key]

    if (
      isPlainObject(bValue) &&
      isPlainObject(aValue)
    ) {
      result[key] = deepMerge(
        aValue as object,
        bValue as object
      )
    } else {
      result[key] = bValue
    }
  }

  return result as Prettify<DeepMergeResult<A, B>>
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  )
}

/**
 * Merges with explicit handling of conflicting keys.
 * Requires a resolver function for keys that exist in both objects.
 * 
 * @example
 * const a = { name: 'John', age: 30 }
 * const b = { name: 'Jane', email: 'jane@example.com' }
 * 
 * const merged = mergeWith(a, b, {
 *   name: (aVal, bVal) => `${aVal} & ${bVal}`,
 * })
 * // { name: 'John & Jane', age: 30, email: 'jane@example.com' }
 */
export function mergeWith<
  A extends object,
  B extends object,
  Resolvers extends Partial<{
    [K in keyof A & keyof B]: (a: A[K], b: B[K]) => unknown
  }>
>(
  a: A,
  b: B,
  resolvers: Resolvers
): Prettify<
  Omit<A, keyof B> &
  Omit<B, keyof Resolvers> &
  { [K in keyof Resolvers]: Resolvers[K] extends (a: unknown, b: unknown) => infer R ? R : never }
> {
  const result = { ...a, ...b } as Record<string, unknown>

  for (const key of Object.keys(resolvers)) {
    const resolver = (resolvers as Record<string, ((a: unknown, b: unknown) => unknown) | undefined>)[key]
    if (resolver && key in a && key in b) {
      result[key] = resolver(
        (a as Record<string, unknown>)[key],
        (b as Record<string, unknown>)[key]
      )
    }
  }

  return result as Prettify<
    Omit<A, keyof B> &
    Omit<B, keyof Resolvers> &
    { [K in keyof Resolvers]: Resolvers[K] extends (a: unknown, b: unknown) => infer R ? R : never }
  >
}

/**
 * Creates a new object with only the specified keys.
 * Type-safe alternative to manual property picking.
 * 
 * @example
 * const user = { id: 1, name: 'John', email: 'john@example.com', password: 'secret' }
 * const public = pick(user, ['id', 'name', 'email'])
 * // Type: { id: number; name: string; email: string }
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Prettify<Pick<T, K>> {
  const result = {} as Pick<T, K>
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key]
    }
  }
  return result as Prettify<Pick<T, K>>
}

/**
 * Creates a new object without the specified keys.
 * Type-safe alternative to manual property omission.
 * 
 * @example
 * const user = { id: 1, name: 'John', password: 'secret' }
 * const safe = omit(user, ['password'])
 * // Type: { id: number; name: string }
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Prettify<Omit<T, K>> {
  const result = { ...obj }
  for (const key of keys) {
    delete (result as Record<string, unknown>)[key as string]
  }
  return result as Prettify<Omit<T, K>>
}

/**
 * Renames keys in an object with type safety.
 * 
 * @example
 * const user = { firstName: 'John', lastName: 'Doe' }
 * const renamed = renameKeys(user, { firstName: 'name' })
 * // Type: { name: string; lastName: string }
 */
export function renameKeys<
  T extends object,
  Mapping extends Partial<Record<keyof T, string>>
>(
  obj: T,
  mapping: Mapping
): Prettify<
  Omit<T, keyof Mapping> &
  { [K in keyof Mapping as Mapping[K] extends string ? Mapping[K] : never]: K extends keyof T ? T[K] : never }
> {
  const result: Record<string, unknown> = {}

  for (const key of Object.keys(obj) as (keyof T)[]) {
    const newKey = mapping[key as keyof Mapping]
    if (newKey !== undefined) {
      result[newKey as string] = obj[key]
    } else {
      result[key as string] = obj[key]
    }
  }

  return result as any
}

/**
 * Creates an object from entries with proper type inference.
 * Better typed than Object.fromEntries.
 * 
 * @example
 * const entries = [['a', 1], ['b', 2]] as const
 * const obj = fromEntries(entries)
 * // Type: { a: 1; b: 2 }
 */
export function fromEntries<
  T extends readonly (readonly [PropertyKey, unknown])[]
>(
  entries: T
): Prettify<{ [E in T[number] as E[0]]: E[1] }> {
  return Object.fromEntries(entries) as any
}

/**
 * Maps object values while preserving keys.
 * 
 * @example
 * const obj = { a: 1, b: 2, c: 3 }
 * const doubled = mapValues(obj, (v) => v * 2)
 * // Type: { a: number; b: number; c: number }
 * // Value: { a: 2, b: 4, c: 6 }
 */
export function mapValues<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], key: keyof T) => U
): { [K in keyof T]: U } {
  const result = {} as { [K in keyof T]: U }
  for (const key of Object.keys(obj) as (keyof T)[]) {
    result[key] = fn(obj[key], key)
  }
  return result
}

/**
 * Maps object keys while preserving values.
 * 
 * @example
 * const obj = { a: 1, b: 2 }
 * const prefixed = mapKeys(obj, (k) => `prefix_${k}`)
 * // { prefix_a: 1, prefix_b: 2 }
 */
export function mapKeys<T extends object, K extends string>(
  obj: T,
  fn: (key: keyof T) => K
): { [P in K]: T[keyof T] } {
  const result = {} as { [P in K]: T[keyof T] }
  for (const key of Object.keys(obj) as (keyof T)[]) {
    const newKey = fn(key)
    result[newKey] = obj[key]
  }
  return result
}
