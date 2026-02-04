import { describe, it, expect } from 'vitest'
import { defineConst } from '../../src/typed/defineConst'

describe('defineConst', () => {
  it('creates frozen object', () => {
    const STATUS = defineConst({
      PENDING: 'pending',
      ACTIVE: 'active',
    })

    expect(STATUS.PENDING).toBe('pending')
    expect(STATUS.ACTIVE).toBe('active')
    expect(Object.isFrozen(STATUS)).toBe(true)
  })

  it('prevents modifications', () => {
    const STATUS = defineConst({ A: 1 })
    expect(() => {
      ;(STATUS as { A: number }).A = 2
    }).toThrow()
  })
})
