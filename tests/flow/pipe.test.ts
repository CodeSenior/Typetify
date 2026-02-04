import { describe, it, expect } from 'vitest'
import { pipe } from '../../src/flow/pipe'

describe('pipe', () => {
  it('returns value with no functions', () => {
    expect(pipe(5)).toBe(5)
  })

  it('applies single function', () => {
    expect(pipe(5, (n) => n * 2)).toBe(10)
  })

  it('applies multiple functions in order', () => {
    const result = pipe(
      5,
      (n) => n * 2,
      (n) => n + 1,
      (n) => `Result: ${n}`
    )
    expect(result).toBe('Result: 11')
  })

  it('works with type transformations', () => {
    const result = pipe(
      'hello',
      (s) => s.length,
      (n) => n > 3
    )
    expect(result).toBe(true)
  })
})
