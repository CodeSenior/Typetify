import { describe, it, expect } from 'vitest'
import { sum } from '../../src/math/sum'

describe('sum', () => {
  it('sums numbers', () => {
    expect(sum([1, 2, 3, 4, 5])).toBe(15)
  })

  it('returns 0 for empty array', () => {
    expect(sum([])).toBe(0)
  })

  it('handles negative numbers', () => {
    expect(sum([-1, 1, -2, 2])).toBe(0)
  })

  it('handles single element', () => {
    expect(sum([42])).toBe(42)
  })
})
