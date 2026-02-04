import { describe, it, expect } from 'vitest'
import { maxBy } from '../../src/collection/maxBy'

describe('maxBy', () => {
  it('finds element with max value', () => {
    const users = [
      { name: 'Alice', age: 30 },
      { name: 'Bob', age: 25 },
      { name: 'Charlie', age: 35 },
    ]
    expect(maxBy(users, (u) => u.age)).toEqual({ name: 'Charlie', age: 35 })
  })

  it('returns undefined for empty array', () => {
    expect(maxBy([], (x: number) => x)).toBe(undefined)
  })

  it('handles single element', () => {
    expect(maxBy([{ v: 10 }], (x) => x.v)).toEqual({ v: 10 })
  })
})
