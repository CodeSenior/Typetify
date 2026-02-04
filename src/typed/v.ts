/**
 * Zero-Effort Type System
 * 
 * The "v" module provides validators with phantom types.
 * Define once, get types for free. No more `type X = Infer<typeof X>`.
 * 
 * @example
 * const User = v.object({
 *   id: v.number(),
 *   name: v.string(),
 *   email: v.email(),
 * })
 * 
 * // Use the type directly with .T
 * function saveUser(user: typeof User.T) {
 *   console.log(user.name) // Full autocomplete!
 * }
 */

// =============================================================================
// CORE TYPES
// =============================================================================

export interface Validator<T> {
  parse(value: unknown): T
  safeParse(value: unknown): { ok: true; value: T } | { ok: false; error: Error }
  is(value: unknown): value is T
  readonly T: T
  optional(): Validator<T | undefined>
  nullable(): Validator<T | null>
  default(value: T): Validator<T>
  transform<U>(fn: (value: T) => U): Validator<U>
  refine(fn: (value: T) => boolean, message?: string): Validator<T>
}

// =============================================================================
// VALIDATOR FACTORY
// =============================================================================

function createValidator<T>(
  parser: (value: unknown) => T,
  checker?: (value: unknown) => boolean
): Validator<T> {
  const validator: Validator<T> = {
    parse: parser,
    
    safeParse(value: unknown) {
      try {
        return { ok: true, value: parser(value) }
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e : new Error(String(e)) }
      }
    },
    
    is(value: unknown): value is T {
      if (checker) return checker(value)
      try {
        parser(value)
        return true
      } catch {
        return false
      }
    },
    
    T: undefined as unknown as T,
    
    optional() {
      return createValidator<T | undefined>(
        (val) => val === undefined ? undefined : parser(val),
        (val) => val === undefined || (checker ? checker(val) : true)
      )
    },
    
    nullable() {
      return createValidator<T | null>(
        (val) => val === null ? null : parser(val),
        (val) => val === null || (checker ? checker(val) : true)
      )
    },
    
    default(defaultValue: T) {
      return createValidator<T>(
        (val) => val === undefined || val === null ? defaultValue : parser(val)
      )
    },
    
    transform<U>(fn: (value: T) => U) {
      return createValidator<U>((val) => fn(parser(val)))
    },
    
    refine(fn: (value: T) => boolean, message = 'Validation failed') {
      return createValidator<T>((val) => {
        const parsed = parser(val)
        if (!fn(parsed)) throw new Error(message)
        return parsed
      })
    },
  }
  
  return validator
}

// =============================================================================
// PRIMITIVE VALIDATORS
// =============================================================================

function stringValidator(): Validator<string> {
  return createValidator(
    (val) => {
      if (typeof val !== 'string') throw new Error(`Expected string, got ${typeof val}`)
      return val
    },
    (val) => typeof val === 'string'
  )
}

function numberValidator(): Validator<number> {
  return createValidator(
    (val) => {
      if (typeof val !== 'number' || Number.isNaN(val)) {
        throw new Error(`Expected number, got ${typeof val}`)
      }
      return val
    },
    (val) => typeof val === 'number' && !Number.isNaN(val)
  )
}

function booleanValidator(): Validator<boolean> {
  return createValidator(
    (val) => {
      if (typeof val !== 'boolean') throw new Error(`Expected boolean, got ${typeof val}`)
      return val
    },
    (val) => typeof val === 'boolean'
  )
}

function dateValidator(): Validator<Date> {
  return createValidator(
    (val) => {
      if (val instanceof Date) return val
      if (typeof val === 'string' || typeof val === 'number') {
        const date = new Date(val)
        if (Number.isNaN(date.getTime())) throw new Error('Invalid date')
        return date
      }
      throw new Error(`Expected date, got ${typeof val}`)
    },
    (val) => val instanceof Date && !Number.isNaN(val.getTime())
  )
}

function literalValidator<T extends string | number | boolean>(value: T): Validator<T> {
  return createValidator(
    (val) => {
      if (val !== value) throw new Error(`Expected ${String(value)}, got ${String(val)}`)
      return value
    },
    (val) => val === value
  )
}

function enumValidator<T extends readonly (string | number)[]>(
  ...values: T
): Validator<T[number]> {
  return createValidator(
    (val) => {
      if (!values.includes(val as T[number])) {
        throw new Error(`Expected one of [${values.join(', ')}], got ${String(val)}`)
      }
      return val as T[number]
    },
    (val) => values.includes(val as T[number])
  )
}

// =============================================================================
// STRING REFINEMENTS
// =============================================================================

function emailValidator(): Validator<string> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return stringValidator().refine((val) => emailRegex.test(val), 'Invalid email')
}

function urlValidator(): Validator<string> {
  return stringValidator().refine((val) => {
    try { new URL(val); return true } catch { return false }
  }, 'Invalid URL')
}

function uuidValidator(): Validator<string> {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return stringValidator().refine((val) => uuidRegex.test(val), 'Invalid UUID')
}

// =============================================================================
// COMPOUND VALIDATORS
// =============================================================================

type InferObject<S extends Record<string, Validator<unknown>>> = {
  [K in keyof S]: S[K]['T']
}

interface ObjectValidator<S extends Record<string, Validator<unknown>>> extends Validator<InferObject<S>> {
  schema: S
  pick<K extends keyof S>(...keys: K[]): ObjectValidator<Pick<S, K>>
  omit<K extends keyof S>(...keys: K[]): ObjectValidator<Omit<S, K>>
  extend<U extends Record<string, Validator<unknown>>>(ext: U): ObjectValidator<S & U>
  partial(): ObjectValidator<{ [K in keyof S]: Validator<S[K]['T'] | undefined> }>
  merge<U extends Record<string, Validator<unknown>>>(other: ObjectValidator<U>): ObjectValidator<S & U>
}

function objectValidator<S extends Record<string, Validator<unknown>>>(
  schema: S
): ObjectValidator<S> {
  const base = createValidator<InferObject<S>>(
    (val) => {
      if (typeof val !== 'object' || val === null) {
        throw new Error(`Expected object, got ${typeof val}`)
      }
      const result = {} as InferObject<S>
      const schemaRecord = schema as Record<string, Validator<unknown>>
      for (const key of Object.keys(schemaRecord)) {
        const fieldValidator = schemaRecord[key]
        if (fieldValidator) {
          (result as Record<string, unknown>)[key] = fieldValidator.parse((val as Record<string, unknown>)[key])
        }
      }
      return result
    },
    (val) => {
      if (typeof val !== 'object' || val === null) return false
      const schemaRec = schema as Record<string, Validator<unknown>>
      for (const key of Object.keys(schemaRec)) {
        const fieldVal = schemaRec[key]
        if (fieldVal && !fieldVal.is((val as Record<string, unknown>)[key])) return false
      }
      return true
    }
  )
  
  const validator = base as ObjectValidator<S>
  validator.schema = schema
  
  validator.pick = <K extends keyof S>(...keys: K[]) => {
    const picked = {} as Pick<S, K>
    for (const key of keys) picked[key] = schema[key]!
    return objectValidator(picked)
  }
  
  validator.omit = <K extends keyof S>(...keys: K[]) => {
    const omitted = { ...schema }
    for (const key of keys) delete (omitted as Record<string, unknown>)[key as string]
    return objectValidator(omitted as unknown as Omit<S, K>)
  }
  
  validator.extend = <U extends Record<string, Validator<unknown>>>(ext: U) => {
    return objectValidator({ ...schema, ...ext } as S & U)
  }
  
  validator.partial = () => {
    const partial = {} as Record<string, Validator<unknown>>
    const schemaRec = schema as Record<string, Validator<unknown>>
    for (const key of Object.keys(schemaRec)) {
      const fieldVal = schemaRec[key]
      if (fieldVal) partial[key] = fieldVal.optional()
    }
    return objectValidator(partial) as ObjectValidator<{ [K in keyof S]: Validator<S[K]['T'] | undefined> }>
  }
  
  validator.merge = <U extends Record<string, Validator<unknown>>>(other: ObjectValidator<U>) => {
    return objectValidator({ ...schema, ...other.schema } as S & U)
  }
  
  return validator
}

function arrayValidator<T>(itemValidator: Validator<T>): Validator<T[]> {
  return createValidator(
    (val) => {
      if (!Array.isArray(val)) throw new Error(`Expected array, got ${typeof val}`)
      return val.map((item, i) => {
        try {
          return itemValidator.parse(item)
        } catch (e) {
          throw new Error(`[${i}]: ${e instanceof Error ? e.message : String(e)}`)
        }
      })
    },
    (val) => Array.isArray(val) && val.every((item) => itemValidator.is(item))
  )
}

function tupleValidator<T extends readonly Validator<unknown>[]>(
  ...validators: T
): Validator<{ [K in keyof T]: T[K] extends Validator<infer U> ? U : never }> {
  type Result = { [K in keyof T]: T[K] extends Validator<infer U> ? U : never }
  return createValidator<Result>(
    (val) => {
      if (!Array.isArray(val)) throw new Error(`Expected tuple, got ${typeof val}`)
      if (val.length !== validators.length) {
        throw new Error(`Expected ${validators.length} elements, got ${val.length}`)
      }
      return validators.map((v, i) => v.parse(val[i])) as Result
    },
    (val) => Array.isArray(val) && val.length === validators.length && validators.every((v, i) => v.is(val[i]))
  )
}

function recordValidator<V>(valueValidator: Validator<V>): Validator<Record<string, V>> {
  return createValidator(
    (val) => {
      if (typeof val !== 'object' || val === null || Array.isArray(val)) {
        throw new Error(`Expected record, got ${typeof val}`)
      }
      const result: Record<string, V> = {}
      for (const [key, value] of Object.entries(val)) {
        result[key] = valueValidator.parse(value)
      }
      return result
    },
    (val) => {
      if (typeof val !== 'object' || val === null || Array.isArray(val)) return false
      return Object.values(val).every((v) => valueValidator.is(v))
    }
  )
}

function unionValidator<T extends readonly Validator<unknown>[]>(
  ...validators: T
): Validator<T[number]['T']> {
  return createValidator(
    (val) => {
      for (const v of validators) {
        const result = v.safeParse(val)
        if (result.ok) return result.value as T[number]['T']
      }
      throw new Error('Value does not match any union member')
    },
    (val) => validators.some((v) => v.is(val))
  )
}

function intersectionValidator<A, B>(
  a: Validator<A>,
  b: Validator<B>
): Validator<A & B> {
  return createValidator(
    (val) => {
      const parsedA = a.parse(val)
      const parsedB = b.parse(val)
      return { ...parsedA, ...parsedB } as A & B
    },
    (val) => a.is(val) && b.is(val)
  )
}

// =============================================================================
// THE "v" NAMESPACE - Zero Effort API
// =============================================================================

export const v = {
  // Primitives
  string: stringValidator,
  number: numberValidator,
  boolean: booleanValidator,
  date: dateValidator,
  
  // String refinements
  email: emailValidator,
  url: urlValidator,
  uuid: uuidValidator,
  
  // Literals & Enums
  literal: literalValidator,
  enum: enumValidator,
  
  // Compound types
  object: objectValidator,
  array: arrayValidator,
  tuple: tupleValidator,
  record: recordValidator,
  union: unionValidator,
  intersection: intersectionValidator,
  
  // Special
  any: () => createValidator<any>((val) => val),
  unknown: () => createValidator<unknown>((val) => val),
  null: () => createValidator<null>((val) => {
    if (val !== null) throw new Error('Expected null')
    return null
  }),
  undefined: () => createValidator<undefined>((val) => {
    if (val !== undefined) throw new Error('Expected undefined')
    return undefined
  }),
} as const

export type { ObjectValidator }
