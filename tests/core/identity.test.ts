import { describe, it, expect } from 'vitest'
import { identity } from '../../src/core/identity'

describe('identity', () => {
  it('returns the same value', () => {
    expect(identity(5)).toBe(5)
    expect(identity('hello')).toBe('hello')
    expect(identity(null)).toBe(null)
  })

  it('returns the same object reference', () => {
    const obj = { a: 1 }
    expect(identity(obj)).toBe(obj)
  })
})
