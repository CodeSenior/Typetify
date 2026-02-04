/**
 * Core types for the schema validation system
 */

import type { Result } from '../result/types'

/**
 * A schema that validates and transforms unknown input to type T
 */
export interface Schema<T> {
  readonly _type: T
  readonly _tag: string
  parse(value: unknown): T
  safeParse(value: unknown): ValidationResult<T>
  is(value: unknown): value is T
  optional(): Schema<T | undefined>
  nullable(): Schema<T | null>
  default(defaultValue: T): Schema<T>
  transform<U>(fn: (value: T) => U): Schema<U>
  refine(predicate: (value: T) => boolean, message?: string): Schema<T>
}

/**
 * Extracts the TypeScript type from a schema
 */
export type Infer<S> = S extends Schema<infer T> ? T : never

/**
 * Validation error with path information
 */
export interface ValidationError {
  path: (string | number)[]
  message: string
  expected: string
  received: string
}

/**
 * Result of a validation operation
 */
export type ValidationResult<T> = Result<T, ValidationError[]>

/**
 * Internal schema implementation
 */
export interface SchemaImpl<T> extends Schema<T> {
  _validate(value: unknown, path: (string | number)[]): ValidationResult<T>
}
