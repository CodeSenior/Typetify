import { describe, it, expect } from 'vitest'
import { camelCase } from '../../src/string/camelCase'

describe('camelCase', () => {
  it('converts space-separated words', () => {
    expect(camelCase('hello world')).toBe('helloWorld')
  })

  it('converts kebab-case', () => {
    expect(camelCase('foo-bar')).toBe('fooBar')
  })

  it('converts snake_case', () => {
    expect(camelCase('foo_bar')).toBe('fooBar')
  })

  it('converts PascalCase', () => {
    expect(camelCase('FooBar')).toBe('fooBar')
  })

  it('handles empty string', () => {
    expect(camelCase('')).toBe('')
  })
})
