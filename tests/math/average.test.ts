import { describe, it, expect } from 'vitest'
import { average } from '../../src/math/average'

describe('average', () => {
  it('calculates average', () => {
    expect(average([1, 2, 3, 4, 5])).toBe(3)
  })

  it('returns NaN for empty array', () => {
    expect(average([])).toBeNaN()
  })

  it('handles single element', () => {
    expect(average([10])).toBe(10)
  })

  it('handles decimals', () => {
    expect(average([1, 2])).toBe(1.5)
  })
})
