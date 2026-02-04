/**
 * Parsing utilities for schemas
 */

import type { Schema, ValidationResult, Infer } from './types'

/**
 * Parse a value with a schema, throwing on validation failure.
 * 
 * @example
 * const UserSchema = object({
 *   id: number(),
 *   name: string(),
 *   email: email()
 * })
 * 
 * const user = parse(UserSchema, jsonData)
 * // Type: { id: number; name: string; email: string }
 * // Throws if validation fails
 */
export function parse<S extends Schema<unknown>>(
  schema: S,
  value: unknown
): Infer<S> {
  return schema.parse(value) as Infer<S>
}

/**
 * Safely parse a value with a schema, returning a Result.
 * 
 * @example
 * const result = safeParse(UserSchema, jsonData)
 * if (result.ok) {
 *   console.log(result.value.name)
 * } else {
 *   console.error(result.error)
 * }
 */
export function safeParse<S extends Schema<unknown>>(
  schema: S,
  value: unknown
): ValidationResult<Infer<S>> {
  return schema.safeParse(value) as ValidationResult<Infer<S>>
}

/**
 * Validate a value against a schema, returning validation errors.
 * 
 * @example
 * const errors = validate(UserSchema, jsonData)
 * if (errors.length === 0) {
 *   // Valid
 * } else {
 *   errors.forEach(e => console.error(`${e.path.join('.')}: ${e.message}`))
 * }
 */
export function validate<S extends Schema<unknown>>(
  schema: S,
  value: unknown
): Array<{ path: (string | number)[]; message: string; expected: string; received: string }> {
  const result = schema.safeParse(value)
  return result.ok ? [] : result.error
}

/**
 * Type guard using a schema.
 * 
 * @example
 * if (is(UserSchema, data)) {
 *   // data is User
 *   console.log(data.name)
 * }
 */
export function is<S extends Schema<unknown>>(
  schema: S,
  value: unknown
): value is Infer<S> {
  return schema.is(value)
}

/**
 * Parse JSON string with schema validation.
 * Solves the "JSON.parse returns any" problem completely.
 * 
 * @example
 * const UserSchema = object({
 *   id: number(),
 *   name: string()
 * })
 * 
 * const result = parseJson(UserSchema, '{"id": 1, "name": "John"}')
 * if (result.ok) {
 *   // result.value is { id: number; name: string }
 * }
 */
export function parseJson<S extends Schema<unknown>>(
  schema: S,
  json: string
): ValidationResult<Infer<S>> {
  try {
    const parsed = JSON.parse(json)
    return safeParse(schema, parsed)
  } catch (e) {
    return {
      ok: false,
      error: [{
        path: [],
        message: e instanceof Error ? e.message : 'Invalid JSON',
        expected: 'valid JSON',
        received: json.slice(0, 50),
      }],
    }
  }
}

/**
 * Create a type guard function from a schema.
 * 
 * @example
 * const isUser = createGuard(UserSchema)
 * 
 * const users = items.filter(isUser)
 * // Type: User[]
 */
export function createGuard<S extends Schema<unknown>>(
  schema: S
): (value: unknown) => value is Infer<S> {
  return (value: unknown): value is Infer<S> => schema.is(value)
}

/**
 * Create a parser function from a schema.
 * 
 * @example
 * const parseUser = createParser(UserSchema)
 * 
 * const user = parseUser(data)
 * // Throws if invalid
 */
export function createParser<S extends Schema<unknown>>(
  schema: S
): (value: unknown) => Infer<S> {
  return (value: unknown) => parse(schema, value)
}
