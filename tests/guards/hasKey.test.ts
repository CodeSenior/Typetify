import { describe, it, expect } from 'vitest'
import { hasKey } from '../../src/guards/hasKey'

describe('hasKey', () => {
  it('returns true if object has the key', () => {
    expect(hasKey({ name: 'John' }, 'name')).toBe(true)
    expect(hasKey({ a: 1, b: 2 }, 'a')).toBe(true)
  })

  it('returns false if object does not have the key', () => {
    expect(hasKey({ name: 'John' }, 'age')).toBe(false)
    expect(hasKey({}, 'any')).toBe(false)
  })

  it('returns false for null and undefined', () => {
    expect(hasKey(null, 'key')).toBe(false)
    expect(hasKey(undefined, 'key')).toBe(false)
  })

  it('returns false for primitives', () => {
    expect(hasKey('string', 'length')).toBe(false)
    expect(hasKey(123, 'toString')).toBe(false)
  })
})
