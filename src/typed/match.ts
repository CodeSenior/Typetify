/**
 * Exhaustive Pattern Matching for Discriminated Unions
 * 
 * This solves the problem of handling all cases in a union type
 * with compile-time exhaustiveness checking.
 */

import type { Prettify } from './types'

/**
 * Extracts the discriminant value from a discriminated union member.
 */
type DiscriminantValue<T, K extends keyof T> = T extends Record<K, infer V> ? V : never

/**
 * Extracts the union member that matches a specific discriminant value.
 */
type ExtractByDiscriminant<T, K extends keyof T, V> = T extends Record<K, V> ? T : never

/**
 * Gets all possible discriminant values from a union.
 */
type DiscriminantValues<T, K extends keyof T> = T extends Record<K, infer V> 
  ? V extends string | number | symbol 
    ? V 
    : never 
  : never

/**
 * Pattern matcher builder for discriminated unions.
 * Provides compile-time exhaustiveness checking.
 * 
 * @example
 * type Result = 
 *   | { status: 'loading' }
 *   | { status: 'success'; data: User }
 *   | { status: 'error'; message: string }
 * 
 * const message = match(result, 'status')
 *   .with('loading', () => 'Loading...')
 *   .with('success', (r) => `Hello ${r.data.name}`)
 *   .with('error', (r) => `Error: ${r.message}`)
 *   .exhaustive()
 */
export function match<T extends Record<K, string | number | symbol>, K extends keyof T>(
  value: T,
  discriminant: K
): MatchBuilder<T, K, DiscriminantValues<T, K>> {
  return new MatchBuilderImpl(value, discriminant, {}) as MatchBuilder<T, K, DiscriminantValues<T, K>>
}

/**
 * Match builder interface with remaining cases tracking.
 */
interface MatchBuilder<T, K extends keyof T, Remaining extends string | number | symbol> {
  /**
   * Handle a specific case.
   */
  with<V extends Remaining, R>(
    value: V,
    handler: (matched: Prettify<ExtractByDiscriminant<T, K, V>>) => R
  ): MatchBuilder<T, K, Exclude<Remaining, V>>

  /**
   * Complete the match, ensuring all cases are handled.
   * Only available when all cases have been covered.
   */
  exhaustive: [Remaining] extends [never] 
    ? () => unknown
    : { error: `Missing cases: ${Remaining & string}` }

  /**
   * Provide a default handler for any remaining cases.
   */
  otherwise<R>(handler: (value: T) => R): R

  /**
   * Run the match and return the result.
   * Only available when all cases are handled.
   */
  run: [Remaining] extends [never] ? () => unknown : { error: `Missing cases: ${Remaining & string}` }
}

/**
 * Internal implementation of the match builder.
 */
class MatchBuilderImpl<T extends Record<K, string | number | symbol>, K extends keyof T> {
  private value: T
  private discriminant: K
  private handlers: Record<string | number | symbol, (value: unknown) => unknown>
  private result: unknown = undefined
  private matched = false

  constructor(
    value: T,
    discriminant: K,
    handlers: Record<string | number | symbol, (value: unknown) => unknown>
  ) {
    this.value = value
    this.discriminant = discriminant
    this.handlers = handlers
  }

  with<V extends string | number | symbol, R>(
    matchValue: V,
    handler: (matched: unknown) => R
  ): MatchBuilderImpl<T, K> {
    const newHandlers = { ...this.handlers, [matchValue]: handler }
    const builder = new MatchBuilderImpl(this.value, this.discriminant, newHandlers)
    
    // Check if this case matches
    const discriminantValue = this.value[this.discriminant] as string | number | symbol
    if (!this.matched && discriminantValue === matchValue) {
      builder.result = handler(this.value)
      builder.matched = true
    } else {
      builder.result = this.result
      builder.matched = this.matched
    }
    
    return builder
  }

  exhaustive(): unknown {
    if (this.matched) {
      return this.result
    }
    throw new Error(`No handler matched for discriminant value: ${String(this.value[this.discriminant])}`)
  }

  otherwise<R>(handler: (value: T) => R): R {
    if (this.matched) {
      return this.result as R
    }
    return handler(this.value)
  }

  run(): unknown {
    return this.exhaustive()
  }
}

/**
 * Simple match function for when you want to handle all cases inline.
 * 
 * @example
 * type Status = 'pending' | 'success' | 'error'
 * 
 * const message = matchValue(status, {
 *   pending: () => 'Loading...',
 *   success: () => 'Done!',
 *   error: () => 'Failed',
 * })
 */
export function matchValue<
  T extends string | number | symbol,
  Cases extends Record<T, () => unknown>
>(
  value: T,
  cases: Cases
): ReturnType<Cases[T]> {
  const handler = cases[value]
  if (!handler) {
    throw new Error(`No handler for value: ${String(value)}`)
  }
  return handler() as ReturnType<Cases[T]>
}

/**
 * Match on a discriminated union with a handler object.
 * Provides exhaustiveness checking through the type system.
 * 
 * @example
 * type Event = 
 *   | { type: 'click'; x: number; y: number }
 *   | { type: 'keypress'; key: string }
 * 
 * const result = matchUnion(event, 'type', {
 *   click: (e) => `Clicked at ${e.x}, ${e.y}`,
 *   keypress: (e) => `Pressed ${e.key}`,
 * })
 */
export function matchUnion<
  T extends Record<K, string | number | symbol>,
  K extends keyof T,
  Handlers extends {
    [V in DiscriminantValues<T, K>]: (value: Prettify<ExtractByDiscriminant<T, K, V>>) => unknown
  }
>(
  value: T,
  discriminant: K,
  handlers: Handlers
): ReturnType<Handlers[DiscriminantValues<T, K>]> {
  const discriminantValue = value[discriminant] as DiscriminantValues<T, K>
  const handler = handlers[discriminantValue]
  return handler(value as any) as ReturnType<Handlers[DiscriminantValues<T, K>]>
}

/**
 * Creates a matcher function for a specific discriminated union type.
 * Useful for reusable matching logic.
 * 
 * @example
 * type Result<T> = { ok: true; value: T } | { ok: false; error: Error }
 * 
 * const matchResult = createMatcher<Result<User>>()('ok')
 * 
 * const name = matchResult(result, {
 *   true: (r) => r.value.name,
 *   false: (r) => 'Unknown',
 * })
 */
export function createMatcher<T extends Record<string, unknown>>() {
  return <K extends keyof T>(discriminant: K) => {
    return <
      Handlers extends {
        [V in DiscriminantValues<T, K>]: (value: Prettify<ExtractByDiscriminant<T, K, V>>) => unknown
      }
    >(
      value: T,
      handlers: Handlers
    ): ReturnType<Handlers[DiscriminantValues<T, K>]> => {
      return matchUnion(value as T & Record<K, string | number | symbol>, discriminant, handlers as any)
    }
  }
}

export type { DiscriminantValue, ExtractByDiscriminant, DiscriminantValues }
