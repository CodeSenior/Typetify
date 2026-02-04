import { describe, it, expect } from 'vitest'
import { ok, err, mapResult, unwrapOr } from '../../src/result'

describe('Result', () => {
  describe('ok', () => {
    it('creates Ok result', () => {
      const result = ok(42)
      expect(result.ok).toBe(true)
      expect(result.value).toBe(42)
    })
  })

  describe('err', () => {
    it('creates Err result', () => {
      const result = err('failed')
      expect(result.ok).toBe(false)
      expect(result.error).toBe('failed')
    })
  })

  describe('mapResult', () => {
    it('maps Ok value', () => {
      const result = mapResult(ok(5), (n) => n * 2)
      expect(result.ok).toBe(true)
      if (result.ok) {
        expect(result.value).toBe(10)
      }
    })

    it('passes through Err', () => {
      const result = mapResult(err('failed'), (n: number) => n * 2)
      expect(result.ok).toBe(false)
    })
  })

  describe('unwrapOr', () => {
    it('returns value for Ok', () => {
      expect(unwrapOr(ok(42), 0)).toBe(42)
    })

    it('returns default for Err', () => {
      expect(unwrapOr(err('failed'), 0)).toBe(0)
    })
  })
})
