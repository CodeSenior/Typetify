import { describe, it, expect, vi } from 'vitest'
import { memoize } from '../../src/fn/memoize'

describe('memoize', () => {
  it('caches results', () => {
    const fn = vi.fn((n: number) => n * 2)
    const memoized = memoize(fn)

    expect(memoized(5)).toBe(10)
    expect(memoized(5)).toBe(10)
    expect(memoized(5)).toBe(10)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('caches different arguments separately', () => {
    const fn = vi.fn((n: number) => n * 2)
    const memoized = memoize(fn)

    expect(memoized(5)).toBe(10)
    expect(memoized(10)).toBe(20)
    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('uses custom resolver', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const memoized = memoize(fn, (a, b) => `${a}-${b}`)

    expect(memoized(1, 2)).toBe(3)
    expect(memoized(1, 2)).toBe(3)
    expect(fn).toHaveBeenCalledTimes(1)

    expect(memoized(1, 3)).toBe(4)
    expect(fn).toHaveBeenCalledTimes(2)
  })
})
