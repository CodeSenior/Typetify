import { describe, it, expect } from 'vitest'
import { mapObject } from '../../src/object/mapObject'

describe('mapObject', () => {
  it('maps values', () => {
    const obj = { a: 1, b: 2, c: 3 }
    const result = mapObject(obj, (v) => v * 2)
    expect(result).toEqual({ a: 2, b: 4, c: 6 })
  })

  it('provides key to callback', () => {
    const obj = { a: 1, b: 2 }
    const result = mapObject(obj, (v, k) => `${k}:${v}`)
    expect(result).toEqual({ a: 'a:1', b: 'b:2' })
  })

  it('handles empty object', () => {
    const result = mapObject({}, (v) => v)
    expect(result).toEqual({})
  })
})
