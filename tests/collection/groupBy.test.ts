import { describe, it, expect } from 'vitest'
import { groupBy } from '../../src/collection/groupBy'

describe('groupBy', () => {
  it('groups by key function', () => {
    const users = [
      { name: 'Alice', role: 'admin' },
      { name: 'Bob', role: 'user' },
      { name: 'Charlie', role: 'admin' },
    ]
    const result = groupBy(users, (u) => u.role)
    expect(result).toEqual({
      admin: [
        { name: 'Alice', role: 'admin' },
        { name: 'Charlie', role: 'admin' },
      ],
      user: [{ name: 'Bob', role: 'user' }],
    })
  })

  it('handles empty array', () => {
    expect(groupBy([], (x) => x)).toEqual({})
  })

  it('works with numbers', () => {
    const result = groupBy([1, 2, 3, 4, 5], (n) => (n % 2 === 0 ? 'even' : 'odd'))
    expect(result).toEqual({
      odd: [1, 3, 5],
      even: [2, 4],
    })
  })
})
