/**
 * Type-Safe Form - Form handling with validation
 */

import { signal } from '../reactive/signal'
import type { Signal } from '../reactive/signal'

export interface FieldState<T> {
  value: Signal<T>
  error: Signal<string | null>
  touched: Signal<boolean>
  dirty: Signal<boolean>
}

export interface FormState<T extends Record<string, unknown>> {
  fields: { [K in keyof T]: FieldState<T[K]> }
  values: () => T
  errors: () => Partial<Record<keyof T, string>>
  isValid: () => boolean
  isDirty: () => boolean
  isTouched: () => boolean
  reset: () => void
  validate: () => boolean
  submit: (handler: (values: T) => void | Promise<void>) => Promise<void>
}

type Validator<T> = (value: T) => string | null

interface FieldConfig<T> {
  initial: T
  validate?: Validator<T> | undefined
}

/**
 * Creates a form field configuration.
 */
export function field<T>(initial: T, validate?: Validator<T>): FieldConfig<T> {
  return { initial, validate }
}

/**
 * Creates a type-safe form with validation.
 * 
 * @example
 * const form = createForm({
 *   email: field('', (v) => !v.includes('@') ? 'Invalid email' : null),
 *   password: field('', (v) => v.length < 8 ? 'Min 8 characters' : null),
 *   remember: field(false),
 * })
 * 
 * // Access field values
 * form.fields.email.value.set('test@example.com')
 * 
 * // Check validation
 * console.log(form.isValid()) // true/false
 * console.log(form.errors()) // { email: null, password: 'Min 8 characters' }
 * 
 * // Submit form
 * await form.submit(async (values) => {
 *   await api.login(values)
 * })
 * 
 * // Reset form
 * form.reset()
 */
export function createForm<T extends Record<string, unknown>>(
  config: { [K in keyof T]: FieldConfig<T[K]> }
): FormState<T> {
  const fieldEntries = Object.entries(config) as [keyof T, FieldConfig<T[keyof T]>][]
  
  const fields = {} as { [K in keyof T]: FieldState<T[K]> }
  
  for (const [key, fieldConfig] of fieldEntries) {
    const value = signal(fieldConfig.initial)
    const error = signal<string | null>(null)
    const touched = signal(false)
    const dirty = signal(false)
    
    const initialValue = fieldConfig.initial
    
    // Subscribe to value changes for validation
    value.subscribe((v) => {
      dirty.set(v !== initialValue)
      if (fieldConfig.validate) {
        error.set(fieldConfig.validate(v))
      }
    })
    
    fields[key] = { value, error, touched, dirty } as FieldState<T[typeof key]>
  }

  const values = (): T => {
    const result = {} as T
    for (const key of Object.keys(fields) as (keyof T)[]) {
      result[key] = fields[key].value() as T[typeof key]
    }
    return result
  }

  const errors = (): Partial<Record<keyof T, string>> => {
    const result: Partial<Record<keyof T, string>> = {}
    for (const key of Object.keys(fields) as (keyof T)[]) {
      const err = fields[key].error()
      if (err) result[key] = err
    }
    return result
  }

  const isValid = (): boolean => {
    return Object.keys(fields).every(key => 
      fields[key as keyof T].error() === null
    )
  }

  const isDirty = (): boolean => {
    return Object.keys(fields).some(key => 
      fields[key as keyof T].dirty()
    )
  }

  const isTouched = (): boolean => {
    return Object.keys(fields).some(key => 
      fields[key as keyof T].touched()
    )
  }

  const reset = (): void => {
    for (const [key, fieldConfig] of fieldEntries) {
      fields[key].value.set(fieldConfig.initial as T[typeof key])
      fields[key].error.set(null)
      fields[key].touched.set(false)
      fields[key].dirty.set(false)
    }
  }

  const validate = (): boolean => {
    for (const [key, fieldConfig] of fieldEntries) {
      if (fieldConfig.validate) {
        const err = fieldConfig.validate(fields[key].value())
        fields[key].error.set(err)
      }
      fields[key].touched.set(true)
    }
    return isValid()
  }

  const submit = async (handler: (values: T) => void | Promise<void>): Promise<void> => {
    if (validate()) {
      await handler(values())
    }
  }

  return {
    fields,
    values,
    errors,
    isValid,
    isDirty,
    isTouched,
    reset,
    validate,
    submit,
  }
}
