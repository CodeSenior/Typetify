import { describe, it, expect } from 'vitest'
import { some, none, mapOption, unwrapOptionOr, fromNullable, toNullable } from '../../src/result'

describe('Option', () => {
  describe('some', () => {
    it('creates Some option', () => {
      const option = some(42)
      expect(option.some).toBe(true)
      expect(option.value).toBe(42)
    })
  })

  describe('none', () => {
    it('creates None option', () => {
      const option = none()
      expect(option.some).toBe(false)
    })
  })

  describe('mapOption', () => {
    it('maps Some value', () => {
      const option = mapOption(some(5), (n) => n * 2)
      expect(option.some).toBe(true)
      if (option.some) {
        expect(option.value).toBe(10)
      }
    })

    it('passes through None', () => {
      const option = mapOption(none(), (n: number) => n * 2)
      expect(option.some).toBe(false)
    })
  })

  describe('unwrapOptionOr', () => {
    it('returns value for Some', () => {
      expect(unwrapOptionOr(some(42), 0)).toBe(42)
    })

    it('returns default for None', () => {
      expect(unwrapOptionOr(none(), 0)).toBe(0)
    })
  })

  describe('fromNullable', () => {
    it('returns Some for value', () => {
      const option = fromNullable(42)
      expect(option.some).toBe(true)
    })

    it('returns None for null', () => {
      const option = fromNullable(null)
      expect(option.some).toBe(false)
    })

    it('returns None for undefined', () => {
      const option = fromNullable(undefined)
      expect(option.some).toBe(false)
    })
  })

  describe('toNullable', () => {
    it('returns value for Some', () => {
      expect(toNullable(some(42))).toBe(42)
    })

    it('returns null for None', () => {
      expect(toNullable(none())).toBe(null)
    })
  })
})
