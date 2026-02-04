import { describe, it, expect } from 'vitest'
import { isEqual } from '../../src/object/isEqual'

describe('isEqual', () => {
  it('compares primitives', () => {
    expect(isEqual(1, 1)).toBe(true)
    expect(isEqual(1, 2)).toBe(false)
    expect(isEqual('a', 'a')).toBe(true)
    expect(isEqual(true, true)).toBe(true)
  })

  it('compares objects', () => {
    expect(isEqual({ a: 1 }, { a: 1 })).toBe(true)
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false)
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false)
  })

  it('compares nested objects', () => {
    expect(isEqual({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true)
    expect(isEqual({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false)
  })

  it('compares arrays', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true)
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false)
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false)
  })

  it('compares dates', () => {
    const d1 = new Date('2024-01-01')
    const d2 = new Date('2024-01-01')
    const d3 = new Date('2024-01-02')
    expect(isEqual(d1, d2)).toBe(true)
    expect(isEqual(d1, d3)).toBe(false)
  })

  it('handles null and undefined', () => {
    expect(isEqual(null, null)).toBe(true)
    expect(isEqual(undefined, undefined)).toBe(true)
    expect(isEqual(null, undefined)).toBe(false)
  })
})
