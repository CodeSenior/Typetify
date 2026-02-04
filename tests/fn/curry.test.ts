import { describe, it, expect } from 'vitest'
import { curry } from '../../src/fn/curry'

describe('curry', () => {
  it('curries a function', () => {
    const add = (a: number, b: number, c: number) => a + b + c
    const curried = curry(add)

    expect(curried(1)(2)(3)).toBe(6)
  })

  it('allows partial application', () => {
    const add = (a: number, b: number, c: number) => a + b + c
    const curried = curry(add)

    expect(curried(1, 2)(3)).toBe(6)
    expect(curried(1)(2, 3)).toBe(6)
    expect(curried(1, 2, 3)).toBe(6)
  })
})
