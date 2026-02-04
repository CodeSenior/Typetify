import { describe, it, expect } from 'vitest'
import { parseBoolean } from '../../src/input/parseBoolean'

describe('parseBoolean', () => {
  it('parses boolean values', () => {
    expect(parseBoolean(true)).toBe(true)
    expect(parseBoolean(false)).toBe(false)
  })

  it('parses string values', () => {
    expect(parseBoolean('true')).toBe(true)
    expect(parseBoolean('false')).toBe(false)
    expect(parseBoolean('TRUE')).toBe(true)
    expect(parseBoolean('FALSE')).toBe(false)
  })

  it('parses yes/no', () => {
    expect(parseBoolean('yes')).toBe(true)
    expect(parseBoolean('no')).toBe(false)
  })

  it('parses on/off', () => {
    expect(parseBoolean('on')).toBe(true)
    expect(parseBoolean('off')).toBe(false)
  })

  it('parses 1/0', () => {
    expect(parseBoolean(1)).toBe(true)
    expect(parseBoolean(0)).toBe(false)
    expect(parseBoolean('1')).toBe(true)
    expect(parseBoolean('0')).toBe(false)
  })

  it('returns undefined for invalid input', () => {
    expect(parseBoolean('maybe')).toBe(undefined)
    expect(parseBoolean(null)).toBe(undefined)
    expect(parseBoolean(undefined)).toBe(undefined)
    expect(parseBoolean(2)).toBe(undefined)
  })
})
