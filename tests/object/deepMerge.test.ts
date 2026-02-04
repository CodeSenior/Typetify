import { describe, it, expect } from 'vitest'
import { deepMerge } from '../../src/object/deepMerge'

describe('deepMerge', () => {
  it('merges shallow objects', () => {
    const a = { x: 1, y: 2 }
    const b = { y: 3, z: 4 }
    expect(deepMerge(a, b)).toEqual({ x: 1, y: 3, z: 4 })
  })

  it('merges nested objects', () => {
    const a = { user: { name: 'John', age: 30 } }
    const b = { user: { age: 31, city: 'NYC' } }
    expect(deepMerge(a, b)).toEqual({
      user: { name: 'John', age: 31, city: 'NYC' },
    })
  })

  it('replaces arrays', () => {
    const a = { items: [1, 2, 3] }
    const b = { items: [4, 5] }
    expect(deepMerge(a, b)).toEqual({ items: [4, 5] })
  })

  it('does not mutate originals', () => {
    const a = { x: 1 }
    const b = { y: 2 }
    const result = deepMerge(a, b)
    expect(a).toEqual({ x: 1 })
    expect(b).toEqual({ y: 2 })
    expect(result).toEqual({ x: 1, y: 2 })
  })
})
