import { describe, it, expect } from 'vitest'
import { isEmpty } from '../../src/guards/isEmpty'

describe('isEmpty', () => {
  it('returns true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('returns true for empty strings and whitespace', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty('   ')).toBe(true)
    expect(isEmpty('\t\n')).toBe(true)
  })

  it('returns false for non-empty strings', () => {
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty(' a ')).toBe(false)
  })

  it('returns true for empty arrays', () => {
    expect(isEmpty([])).toBe(true)
  })

  it('returns false for non-empty arrays', () => {
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty([null])).toBe(false)
  })

  it('returns true for empty objects', () => {
    expect(isEmpty({})).toBe(true)
  })

  it('returns false for non-empty objects', () => {
    expect(isEmpty({ a: 1 })).toBe(false)
  })

  it('handles Map and Set', () => {
    expect(isEmpty(new Map())).toBe(true)
    expect(isEmpty(new Set())).toBe(true)
    expect(isEmpty(new Map([['a', 1]]))).toBe(false)
    expect(isEmpty(new Set([1]))).toBe(false)
  })
})
