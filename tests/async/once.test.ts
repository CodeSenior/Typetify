import { describe, it, expect, vi } from 'vitest'
import { once } from '../../src/async/once'

describe('once', () => {
  it('calls function only once', () => {
    const fn = vi.fn().mockReturnValue('result')
    const onceFn = once(fn)

    expect(onceFn()).toBe('result')
    expect(onceFn()).toBe('result')
    expect(onceFn()).toBe('result')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('passes arguments to first call', () => {
    const fn = vi.fn((a: number, b: number) => a + b)
    const onceFn = once(fn)

    expect(onceFn(1, 2)).toBe(3)
    expect(onceFn(10, 20)).toBe(3) // Returns cached result
    expect(fn).toHaveBeenCalledWith(1, 2)
  })
})
