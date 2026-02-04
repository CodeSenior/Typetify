import { describe, it, expect } from 'vitest'
import { isUrl } from '../../src/input/isUrl'

describe('isUrl', () => {
  it('validates correct URLs', () => {
    expect(isUrl('https://example.com')).toBe(true)
    expect(isUrl('http://localhost:3000')).toBe(true)
    expect(isUrl('https://example.com/path?query=1')).toBe(true)
  })

  it('rejects invalid URLs', () => {
    expect(isUrl('not-a-url')).toBe(false)
    expect(isUrl('example.com')).toBe(false)
    expect(isUrl('')).toBe(false)
  })
})
