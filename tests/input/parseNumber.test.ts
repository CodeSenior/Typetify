import { describe, it, expect } from 'vitest'
import { parseNumber } from '../../src/input/parseNumber'

describe('parseNumber', () => {
  it('parses number strings', () => {
    expect(parseNumber('42')).toBe(42)
    expect(parseNumber('3.14')).toBe(3.14)
    expect(parseNumber('-10')).toBe(-10)
  })

  it('returns number as-is', () => {
    expect(parseNumber(42)).toBe(42)
    expect(parseNumber(0)).toBe(0)
  })

  it('returns undefined for invalid input', () => {
    expect(parseNumber('abc')).toBe(undefined)
    expect(parseNumber('')).toBe(undefined)
    expect(parseNumber('   ')).toBe(undefined)
    expect(parseNumber(null)).toBe(undefined)
    expect(parseNumber(undefined)).toBe(undefined)
    expect(parseNumber(NaN)).toBe(undefined)
  })

  it('trims whitespace', () => {
    expect(parseNumber('  42  ')).toBe(42)
  })
})
