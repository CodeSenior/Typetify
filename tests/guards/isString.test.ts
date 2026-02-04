import { describe, it, expect } from 'vitest'
import { isString } from '../../src/guards/isString'

describe('isString', () => {
  it('returns true for strings', () => {
    expect(isString('')).toBe(true)
    expect(isString('hello')).toBe(true)
    expect(isString(String('test'))).toBe(true)
  })

  it('returns false for non-strings', () => {
    expect(isString(123)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString({})).toBe(false)
    expect(isString([])).toBe(false)
  })
})
