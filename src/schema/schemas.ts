/**
 * Schema definitions for common types
 */

import type { Schema, SchemaImpl, ValidationResult } from './types'
import { createSchema, validationError } from './base'
import { ok } from '../result/ok'
import { err } from '../result/err'

/**
 * String schema
 */
export function string(): Schema<string> {
  return createSchema<string>('string', (value, path) => {
    if (typeof value === 'string') {
      return ok(value)
    }
    return err([validationError(path, 'Expected string', 'string', value)])
  })
}

/**
 * Number schema (excludes NaN)
 */
export function number(): Schema<number> {
  return createSchema<number>('number', (value, path) => {
    if (typeof value === 'number' && !Number.isNaN(value)) {
      return ok(value)
    }
    return err([validationError(path, 'Expected number', 'number', value)])
  })
}

/**
 * Boolean schema
 */
export function boolean(): Schema<boolean> {
  return createSchema<boolean>('boolean', (value, path) => {
    if (typeof value === 'boolean') {
      return ok(value)
    }
    return err([validationError(path, 'Expected boolean', 'boolean', value)])
  })
}

/**
 * Literal schema for exact values
 */
export function literal<T extends string | number | boolean>(expected: T): Schema<T> {
  return createSchema<T>(`literal(${JSON.stringify(expected)})`, (value, path) => {
    if (value === expected) {
      return ok(expected)
    }
    return err([validationError(path, `Expected ${JSON.stringify(expected)}`, String(expected), value)])
  })
}

/**
 * Array schema
 */
export function array<T>(itemSchema: Schema<T>): Schema<T[]> {
  const impl = itemSchema as SchemaImpl<T>
  return createSchema<T[]>(`array(${impl._tag})`, (value, path) => {
    if (!Array.isArray(value)) {
      return err([validationError(path, 'Expected array', 'array', value)])
    }
    
    const results: T[] = []
    const errors: Array<{ path: (string | number)[]; message: string; expected: string; received: string }> = []
    
    for (let i = 0; i < value.length; i++) {
      const result = impl._validate(value[i], [...path, i])
      if (result.ok) {
        results.push(result.value)
      } else {
        errors.push(...result.error)
      }
    }
    
    if (errors.length > 0) {
      return err(errors)
    }
    
    return ok(results)
  })
}

/**
 * Object schema with shape definition
 */
export function object<T extends Record<string, Schema<unknown>>>(
  shape: T
): Schema<{ [K in keyof T]: T[K] extends Schema<infer U> ? U : never }> {
  type Output = { [K in keyof T]: T[K] extends Schema<infer U> ? U : never }
  
  const shapeEntries = Object.entries(shape) as [string, SchemaImpl<unknown>][]
  const tag = `object({ ${shapeEntries.map(([k, v]) => `${k}: ${v._tag}`).join(', ')} })`
  
  return createSchema<Output>(tag, (value, path) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return err([validationError(path, 'Expected object', 'object', value)])
    }
    
    const obj = value as Record<string, unknown>
    const result: Record<string, unknown> = {}
    const errors: Array<{ path: (string | number)[]; message: string; expected: string; received: string }> = []
    
    for (const [key, schema] of shapeEntries) {
      const fieldResult = schema._validate(obj[key], [...path, key])
      if (fieldResult.ok) {
        result[key] = fieldResult.value
      } else {
        errors.push(...fieldResult.error)
      }
    }
    
    if (errors.length > 0) {
      return err(errors)
    }
    
    return ok(result as Output)
  })
}

/**
 * Optional schema wrapper
 */
export function optional<T>(schema: Schema<T>): Schema<T | undefined> {
  return (schema as SchemaImpl<T>).optional()
}

/**
 * Nullable schema wrapper
 */
export function nullable<T>(schema: Schema<T>): Schema<T | null> {
  return (schema as SchemaImpl<T>).nullable()
}

/**
 * Union schema (oneOf)
 */
export function union<T extends readonly Schema<unknown>[]>(
  schemas: T
): Schema<T[number] extends Schema<infer U> ? U : never> {
  type Output = T[number] extends Schema<infer U> ? U : never
  
  const impls = schemas as unknown as readonly SchemaImpl<unknown>[]
  const tag = `union(${impls.map(s => s._tag).join(' | ')})`
  
  return createSchema<Output>(tag, (value, path) => {
    for (const schema of impls) {
      const result = schema._validate(value, path)
      if (result.ok) {
        return ok(result.value as Output)
      }
    }
    
    return err([validationError(
      path, 
      `Expected one of: ${impls.map(s => s._tag).join(', ')}`,
      tag,
      value
    )])
  })
}

/**
 * Intersection schema (allOf)
 */
export function intersection<A, B>(
  schemaA: Schema<A>,
  schemaB: Schema<B>
): Schema<A & B> {
  const implA = schemaA as SchemaImpl<A>
  const implB = schemaB as SchemaImpl<B>
  const tag = `intersection(${implA._tag} & ${implB._tag})`
  
  return createSchema<A & B>(tag, (value, path) => {
    const resultA = implA._validate(value, path)
    if (!resultA.ok) {
      return resultA as ValidationResult<A & B>
    }
    
    const resultB = implB._validate(value, path)
    if (!resultB.ok) {
      return resultB as ValidationResult<A & B>
    }
    
    return ok({ ...resultA.value, ...resultB.value } as A & B)
  })
}

/**
 * Record schema (dictionary)
 */
export function record<V>(valueSchema: Schema<V>): Schema<Record<string, V>> {
  const impl = valueSchema as SchemaImpl<V>
  const tag = `record(${impl._tag})`
  
  return createSchema<Record<string, V>>(tag, (value, path) => {
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return err([validationError(path, 'Expected object', 'object', value)])
    }
    
    const obj = value as Record<string, unknown>
    const result: Record<string, V> = {}
    const errors: Array<{ path: (string | number)[]; message: string; expected: string; received: string }> = []
    
    for (const [key, val] of Object.entries(obj)) {
      const fieldResult = impl._validate(val, [...path, key])
      if (fieldResult.ok) {
        result[key] = fieldResult.value
      } else {
        errors.push(...fieldResult.error)
      }
    }
    
    if (errors.length > 0) {
      return err(errors)
    }
    
    return ok(result)
  })
}

/**
 * Tuple schema
 */
export function tuple<T extends readonly Schema<unknown>[]>(
  schemas: T
): Schema<{ [K in keyof T]: T[K] extends Schema<infer U> ? U : never }> {
  type Output = { [K in keyof T]: T[K] extends Schema<infer U> ? U : never }
  
  const impls = schemas as unknown as readonly SchemaImpl<unknown>[]
  const tag = `tuple([${impls.map(s => s._tag).join(', ')}])`
  
  return createSchema<Output>(tag, (value, path) => {
    if (!Array.isArray(value)) {
      return err([validationError(path, 'Expected array', 'array', value)])
    }
    
    if (value.length !== impls.length) {
      return err([validationError(
        path, 
        `Expected tuple of length ${impls.length}`,
        `[${impls.map(s => s._tag).join(', ')}]`,
        value
      )])
    }
    
    const results: unknown[] = []
    const errors: Array<{ path: (string | number)[]; message: string; expected: string; received: string }> = []
    
    for (let i = 0; i < impls.length; i++) {
      const result = impls[i]!._validate(value[i], [...path, i])
      if (result.ok) {
        results.push(result.value)
      } else {
        errors.push(...result.error)
      }
    }
    
    if (errors.length > 0) {
      return err(errors)
    }
    
    return ok(results as unknown as Output)
  })
}

/**
 * Unknown schema (accepts anything)
 */
export function unknown(): Schema<unknown> {
  return createSchema<unknown>('unknown', (value) => ok(value))
}

/**
 * Any schema (accepts anything, typed as any)
 */
export function any(): Schema<any> {
  return createSchema<any>('any', (value) => ok(value))
}

/**
 * Date schema (validates Date objects or ISO strings)
 */
export function date(): Schema<Date> {
  return createSchema<Date>('date', (value, path) => {
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
      return ok(value)
    }
    
    if (typeof value === 'string') {
      const parsed = new Date(value)
      if (!Number.isNaN(parsed.getTime())) {
        return ok(parsed)
      }
    }
    
    return err([validationError(path, 'Expected valid date', 'Date', value)])
  })
}

/**
 * Email schema (string with email format)
 */
export function email(): Schema<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  
  return createSchema<string>('email', (value, path) => {
    if (typeof value !== 'string') {
      return err([validationError(path, 'Expected string', 'string', value)])
    }
    
    if (!emailRegex.test(value)) {
      return err([validationError(path, 'Expected valid email', 'email', value)])
    }
    
    return ok(value)
  })
}

/**
 * URL schema (string with URL format)
 */
export function url(): Schema<string> {
  return createSchema<string>('url', (value, path) => {
    if (typeof value !== 'string') {
      return err([validationError(path, 'Expected string', 'string', value)])
    }
    
    try {
      new URL(value)
      return ok(value)
    } catch {
      return err([validationError(path, 'Expected valid URL', 'url', value)])
    }
  })
}

/**
 * UUID schema (string with UUID format)
 */
export function uuid(): Schema<string> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  
  return createSchema<string>('uuid', (value, path) => {
    if (typeof value !== 'string') {
      return err([validationError(path, 'Expected string', 'string', value)])
    }
    
    if (!uuidRegex.test(value)) {
      return err([validationError(path, 'Expected valid UUID', 'uuid', value)])
    }
    
    return ok(value)
  })
}
