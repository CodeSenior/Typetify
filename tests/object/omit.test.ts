import { describe, it, expect } from 'vitest'
import { omit } from '../../src/object/omit'

describe('omit', () => {
  it('omits specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(omit(obj, ['b'])).toEqual({ a: 1, c: 3 })
  })

  it('returns copy if no keys to omit', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, [])).toEqual({ a: 1, b: 2 })
  })

  it('handles non-existent keys', () => {
    const obj = { a: 1, b: 2 }
    expect(omit(obj, ['c' as keyof typeof obj])).toEqual({ a: 1, b: 2 })
  })

  it('does not mutate original object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = omit(obj, ['b'])
    expect(obj).toEqual({ a: 1, b: 2, c: 3 })
    expect(result).toEqual({ a: 1, c: 3 })
  })
})
