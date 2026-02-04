import { describe, it, expect } from 'vitest'
import { assert } from '../../src/core/assert'

describe('assert', () => {
  it('does not throw for truthy values', () => {
    expect(() => assert(true)).not.toThrow()
    expect(() => assert(1)).not.toThrow()
    expect(() => assert('hello')).not.toThrow()
    expect(() => assert({})).not.toThrow()
  })

  it('throws for falsy values', () => {
    expect(() => assert(false)).toThrow('Assertion failed')
    expect(() => assert(null)).toThrow('Assertion failed')
    expect(() => assert(undefined)).toThrow('Assertion failed')
    expect(() => assert(0)).toThrow('Assertion failed')
    expect(() => assert('')).toThrow('Assertion failed')
  })

  it('throws with custom message', () => {
    expect(() => assert(false, 'Custom error')).toThrow('Custom error')
  })
})
