import { describe, it, expect } from 'vitest'
import { pick } from '../../src/object/pick'

describe('pick', () => {
  it('picks specified keys', () => {
    const obj = { a: 1, b: 2, c: 3 }
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('ignores non-existent keys', () => {
    const obj = { a: 1, b: 2 }
    expect(pick(obj, ['a', 'c' as keyof typeof obj])).toEqual({ a: 1 })
  })

  it('returns empty object for empty keys array', () => {
    const obj = { a: 1, b: 2 }
    expect(pick(obj, [])).toEqual({})
  })

  it('does not mutate original object', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = pick(obj, ['a'])
    expect(obj).toEqual({ a: 1, b: 2, c: 3 })
    expect(result).toEqual({ a: 1 })
  })
})
