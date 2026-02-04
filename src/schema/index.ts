/**
 * Schema Validation Module
 * 
 * Type-safe runtime validation without external dependencies.
 * Solves the "JSON.parse returns any" problem.
 */

export { 
  string, 
  number, 
  boolean, 
  literal,
  array,
  object,
  optional,
  nullable,
  union,
  intersection,
  record,
  tuple,
  unknown as unknownSchema,
  any as anySchema,
  date,
  email,
  url,
  uuid,
} from './schemas'

export { parse, safeParse, validate, is, parseJson, createGuard, createParser } from './parse'

export type { 
  Schema, 
  Infer, 
  ValidationError,
  ValidationResult,
} from './types'
