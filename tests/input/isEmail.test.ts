import { describe, it, expect } from 'vitest'
import { isEmail } from '../../src/input/isEmail'

describe('isEmail', () => {
  it('validates correct emails', () => {
    expect(isEmail('user@example.com')).toBe(true)
    expect(isEmail('test.user@domain.org')).toBe(true)
    expect(isEmail('user+tag@example.co.uk')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(isEmail('invalid')).toBe(false)
    expect(isEmail('invalid@')).toBe(false)
    expect(isEmail('@domain.com')).toBe(false)
    expect(isEmail('user@')).toBe(false)
    expect(isEmail('')).toBe(false)
  })
})
