import { describe, it, expect } from 'vitest'
import { slugify } from '../../src/string/slugify'

describe('slugify', () => {
  it('converts to lowercase slug', () => {
    expect(slugify('Hello World')).toBe('hello-world')
  })

  it('removes special characters', () => {
    expect(slugify('Hello World!')).toBe('hello-world')
  })

  it('handles accented characters', () => {
    expect(slugify('Café Résumé')).toBe('cafe-resume')
  })

  it('handles multiple spaces', () => {
    expect(slugify('  Multiple   Spaces  ')).toBe('multiple-spaces')
  })

  it('handles empty string', () => {
    expect(slugify('')).toBe('')
  })
})
