import { describe, it, expect } from 'vitest'
import { safeJsonParse } from '../../src/input/safeJsonParse'

describe('safeJsonParse', () => {
  it('parses valid JSON', () => {
    const result = safeJsonParse('{"name": "John"}')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual({ name: 'John' })
    }
  })

  it('returns error for invalid JSON', () => {
    const result = safeJsonParse('not json')
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error)
    }
  })

  it('parses arrays', () => {
    const result = safeJsonParse('[1, 2, 3]')
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual([1, 2, 3])
    }
  })

  it('parses primitives', () => {
    expect(safeJsonParse('42')).toEqual({ ok: true, value: 42 })
    expect(safeJsonParse('"hello"')).toEqual({ ok: true, value: 'hello' })
    expect(safeJsonParse('true')).toEqual({ ok: true, value: true })
    expect(safeJsonParse('null')).toEqual({ ok: true, value: null })
  })
})
