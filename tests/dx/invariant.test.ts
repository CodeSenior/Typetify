import { describe, it, expect } from 'vitest'
import { invariant } from '../../src/dx/invariant'

describe('invariant', () => {
  it('does not throw for truthy values', () => {
    expect(() => invariant(true, 'message')).not.toThrow()
    expect(() => invariant(1, 'message')).not.toThrow()
    expect(() => invariant({}, 'message')).not.toThrow()
  })

  it('throws for falsy values with prefixed message', () => {
    expect(() => invariant(false, 'something wrong')).toThrow(
      'Invariant violation: something wrong'
    )
  })
})
