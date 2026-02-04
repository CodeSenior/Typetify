import { describe, it, expect } from 'vitest'
import { median } from '../../src/math/median'

describe('median', () => {
  it('calculates median for odd length', () => {
    expect(median([1, 2, 3, 4, 5])).toBe(3)
  })

  it('calculates median for even length', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5)
  })

  it('returns NaN for empty array', () => {
    expect(median([])).toBeNaN()
  })

  it('handles unsorted array', () => {
    expect(median([5, 1, 3, 2, 4])).toBe(3)
  })
})
