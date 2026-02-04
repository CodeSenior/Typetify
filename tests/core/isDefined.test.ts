import { describe, it, expect } from 'vitest'
import { isDefined } from '../../src/core/isDefined'

describe('isDefined', () => {
  it('returns true for defined values', () => {
    expect(isDefined(0)).toBe(true)
    expect(isDefined('')).toBe(true)
    expect(isDefined(false)).toBe(true)
    expect(isDefined([])).toBe(true)
    expect(isDefined({})).toBe(true)
  })

  it('returns false for null', () => {
    expect(isDefined(null)).toBe(false)
  })

  it('returns false for undefined', () => {
    expect(isDefined(undefined)).toBe(false)
  })

  it('works with Array.filter', () => {
    const items = [1, null, 2, undefined, 3]
    const result = items.filter(isDefined)
    expect(result).toEqual([1, 2, 3])
  })
})
