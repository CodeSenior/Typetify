import { describe, it, expect } from 'vitest'
import { defineEnum } from '../../src/typed/defineEnum'

describe('defineEnum', () => {
  it('creates enum-like object', () => {
    const Status = defineEnum(['pending', 'active', 'done'] as const)
    expect(Status.pending).toBe('pending')
    expect(Status.active).toBe('active')
    expect(Status.done).toBe('done')
  })

  it('is frozen', () => {
    const Status = defineEnum(['a', 'b'] as const)
    expect(Object.isFrozen(Status)).toBe(true)
  })

  it('works with Object.values', () => {
    const Status = defineEnum(['pending', 'active'] as const)
    expect(Object.values(Status)).toEqual(['pending', 'active'])
  })
})
