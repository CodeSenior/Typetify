import { describe, it, expect } from 'vitest'
import { partition } from '../../src/collection/partition'

describe('partition', () => {
  it('splits array by predicate', () => {
    const [evens, odds] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0)
    expect(evens).toEqual([2, 4])
    expect(odds).toEqual([1, 3, 5])
  })

  it('handles all pass', () => {
    const [pass, fail] = partition([2, 4, 6], (n) => n % 2 === 0)
    expect(pass).toEqual([2, 4, 6])
    expect(fail).toEqual([])
  })

  it('handles all fail', () => {
    const [pass, fail] = partition([1, 3, 5], (n) => n % 2 === 0)
    expect(pass).toEqual([])
    expect(fail).toEqual([1, 3, 5])
  })

  it('handles empty array', () => {
    const [pass, fail] = partition([], () => true)
    expect(pass).toEqual([])
    expect(fail).toEqual([])
  })
})
