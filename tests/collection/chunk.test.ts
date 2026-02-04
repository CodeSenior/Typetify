import { describe, it, expect } from 'vitest'
import { chunk } from '../../src/collection/chunk'

describe('chunk', () => {
  it('splits array into chunks', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]])
  })

  it('handles exact division', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([
      [1, 2],
      [3, 4],
    ])
  })

  it('handles chunk size larger than array', () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]])
  })

  it('handles empty array', () => {
    expect(chunk([], 3)).toEqual([])
  })

  it('throws for invalid chunk size', () => {
    expect(() => chunk([1, 2, 3], 0)).toThrow()
    expect(() => chunk([1, 2, 3], -1)).toThrow()
  })
})
