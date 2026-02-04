import { describe, it, expect } from 'vitest'
import { unique } from '../../src/collection/unique'

describe('unique', () => {
  it('removes duplicates from array', () => {
    expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
  })

  it('preserves order', () => {
    expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2])
  })

  it('works with strings', () => {
    expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
  })

  it('uses key function for uniqueness', () => {
    const items = [
      { id: 1, name: 'a' },
      { id: 1, name: 'b' },
      { id: 2, name: 'c' },
    ]
    const result = unique(items, (item) => item.id)
    expect(result).toEqual([
      { id: 1, name: 'a' },
      { id: 2, name: 'c' },
    ])
  })

  it('handles empty array', () => {
    expect(unique([])).toEqual([])
  })
})
