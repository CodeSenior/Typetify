import { describe, it, expect } from 'vitest'
import { capitalize } from '../../src/string/capitalize'

describe('capitalize', () => {
  it('capitalizes first letter', () => {
    expect(capitalize('hello')).toBe('Hello')
    expect(capitalize('world')).toBe('World')
  })

  it('handles empty string', () => {
    expect(capitalize('')).toBe('')
  })

  it('handles already capitalized', () => {
    expect(capitalize('Hello')).toBe('Hello')
    expect(capitalize('HELLO')).toBe('HELLO')
  })

  it('handles single character', () => {
    expect(capitalize('a')).toBe('A')
  })
})
