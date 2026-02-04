import { describe, it, expect } from 'vitest'
import { take } from '../../src/collection/take'

describe('take', () => {
  it('takes first n elements', () => {
    expect(take([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 3])
  })

  it('returns all if n > length', () => {
    expect(take([1, 2], 5)).toEqual([1, 2])
  })

  it('returns empty for n <= 0', () => {
    expect(take([1, 2, 3], 0)).toEqual([])
    expect(take([1, 2, 3], -1)).toEqual([])
  })

  it('handles empty array', () => {
    expect(take([], 3)).toEqual([])
  })
})
