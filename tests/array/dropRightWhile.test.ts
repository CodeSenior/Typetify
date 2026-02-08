import { describe, it, expect } from 'vitest'
import { dropRightWhile } from '../../src/array/dropRightWhile'

describe('dropRightWhile', () => {
  it('should drop elements from the end while predicate returns true', () => {
    const result = dropRightWhile([1, 2, 3, 4], n => n > 2)
    expect(result).toEqual([1, 2])
  })

  it('should stop dropping when predicate returns false', () => {
    const result = dropRightWhile([1, 9, 12, 0, 6, -2, 0, 76, 90], n => n > 8)
    expect(result).toEqual([1, 9, 12, 0, 6, -2, 0])
  })

  it('should return empty array if all elements satisfy predicate', () => {
    const result = dropRightWhile([5, 6, 7, 8], n => n > 4)
    expect(result).toEqual([])
  })

  it('should return full array if last element does not satisfy predicate', () => {
    const result = dropRightWhile([1, 9, 12, 0, 6, 90, 76, -2, 0], n => n > 8)
    expect(result).toEqual([1, 9, 12, 0, 6, 90, 76, -2, 0])
  })

  it('should handle empty array', () => {
    const result = dropRightWhile([], n => n > 0)
    expect(result).toEqual([])
  })

  it('should work with objects and custom predicate', () => {
    const users = [
      { name: 'Alice', active: true },
      { name: 'Bob', active: false },
      { name: 'Charlie', active: false }
    ]
    const result = dropRightWhile(users, u => !u.active)
    expect(result).toEqual([{ name: 'Alice', active: true }])
  })

  it('should drop multiple consecutive elements from end', () => {
    const result = dropRightWhile([1, 2, 10, 20, 30], n => n >= 10)
    expect(result).toEqual([1, 2])
  })
})
