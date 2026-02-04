import { describe, it, expect } from 'vitest'
import { match } from '../../src/flow/match'

describe('match', () => {
  it('matches first matching case', () => {
    const getDiscount = match<number, string>()
      .with(
        (n) => n >= 100,
        () => '20% off'
      )
      .with(
        (n) => n >= 50,
        () => '10% off'
      )
      .otherwise(() => 'No discount')

    expect(getDiscount(150)).toBe('20% off')
    expect(getDiscount(75)).toBe('10% off')
    expect(getDiscount(25)).toBe('No discount')
  })

  it('returns otherwise value when no match', () => {
    const fn = match<string, number>()
      .with(
        (s) => s === 'a',
        () => 1
      )
      .otherwise(() => 0)

    expect(fn('b')).toBe(0)
  })

  it('run returns undefined when no match', () => {
    const matcher = match<number, string>().with(
      (n) => n > 10,
      () => 'big'
    )

    expect(matcher.run(5)).toBe(undefined)
    expect(matcher.run(15)).toBe('big')
  })
})
