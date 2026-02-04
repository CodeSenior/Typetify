/**
 * Base schema implementation
 */

import type { Schema, SchemaImpl, ValidationResult, ValidationError } from './types'
import { ok } from '../result/ok'
import { err } from '../result/err'

export function createSchema<T>(
  tag: string,
  validate: (value: unknown, path: (string | number)[]) => ValidationResult<T>
): SchemaImpl<T> {
  const schema: SchemaImpl<T> = {
    _type: undefined as unknown as T,
    _tag: tag,
    
    _validate: validate,
    
    parse(value: unknown): T {
      const result = this._validate(value, [])
      if (result.ok) {
        return result.value
      }
      const errors = result.error
      const message = errors.map(e => 
        e.path.length > 0 
          ? `${e.path.join('.')}: ${e.message}`
          : e.message
      ).join('; ')
      throw new TypeError(`Validation failed: ${message}`)
    },
    
    safeParse(value: unknown): ValidationResult<T> {
      return this._validate(value, [])
    },
    
    is(value: unknown): value is T {
      return this._validate(value, []).ok
    },
    
    optional(): Schema<T | undefined> {
      return createSchema<T | undefined>(
        `${tag} | undefined`,
        (value, path) => {
          if (value === undefined) {
            return ok(undefined)
          }
          return validate(value, path) as ValidationResult<T | undefined>
        }
      )
    },
    
    nullable(): Schema<T | null> {
      return createSchema<T | null>(
        `${tag} | null`,
        (value, path) => {
          if (value === null) {
            return ok(null)
          }
          return validate(value, path) as ValidationResult<T | null>
        }
      )
    },
    
    default(defaultValue: T): Schema<T> {
      return createSchema<T>(
        tag,
        (value, path) => {
          if (value === undefined) {
            return ok(defaultValue)
          }
          return validate(value, path)
        }
      )
    },
    
    transform<U>(fn: (value: T) => U): Schema<U> {
      return createSchema<U>(
        `transform(${tag})`,
        (value, path) => {
          const result = validate(value, path)
          if (!result.ok) {
            return result as ValidationResult<U>
          }
          try {
            return ok(fn(result.value))
          } catch (e) {
            return err([{
              path,
              message: e instanceof Error ? e.message : 'Transform failed',
              expected: 'valid transformation',
              received: String(value),
            }])
          }
        }
      )
    },
    
    refine(predicate: (value: T) => boolean, message = 'Refinement failed'): Schema<T> {
      return createSchema<T>(
        `refine(${tag})`,
        (value, path) => {
          const result = validate(value, path)
          if (!result.ok) {
            return result
          }
          if (!predicate(result.value)) {
            return err([{
              path,
              message,
              expected: 'value passing refinement',
              received: String(value),
            }])
          }
          return result
        }
      )
    },
  }
  
  return schema
}

export function validationError(
  path: (string | number)[],
  message: string,
  expected: string,
  received: unknown
): ValidationError {
  return {
    path,
    message,
    expected,
    received: typeof received === 'object' 
      ? JSON.stringify(received)?.slice(0, 50) ?? 'object'
      : String(received),
  }
}
