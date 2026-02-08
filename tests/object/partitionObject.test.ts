import { describe, it, expect } from 'vitest'
import { partitionObject } from '../../src/collection/partitionObject'

describe('partitionObject', () => {
  it('should partition object by value type', () => {
    const data = { apple: 'fruit', carrot: 'vegetable', banana: 'fruit', broccoli: 'vegetable' }
    const [fruits, vegetables] = partitionObject(data, (value) => value === 'fruit')
    
    expect(fruits).toEqual({ apple: 'fruit', banana: 'fruit' })
    expect(vegetables).toEqual({ carrot: 'vegetable', broccoli: 'vegetable' })
  })

  it('should partition object with nested objects', () => {
    const users = {
      user1: { name: 'Alice', active: true },
      user2: { name: 'Bob', active: false },
      user3: { name: 'Charlie', active: true }
    }
    const [active, inactive] = partitionObject(users, (user) => user.active)
    
    expect(active).toEqual({
      user1: { name: 'Alice', active: true },
      user3: { name: 'Charlie', active: true }
    })
    expect(inactive).toEqual({
      user2: { name: 'Bob', active: false }
    })
  })

  it('should partition by numeric values', () => {
    const scores = { math: 85, english: 92, science: 78, history: 95 }
    const [highScores, lowScores] = partitionObject(scores, (score) => score >= 90)
    
    expect(highScores).toEqual({ english: 92, history: 95 })
    expect(lowScores).toEqual({ math: 85, science: 78 })
  })

  it('should use key in predicate', () => {
    const items = { item1: 10, item2: 20, item3: 5 }
    const [expensive, cheap] = partitionObject(
      items,
      (value, key) => value > 15
    )
    
    expect(expensive).toEqual({ item2: 20 })
    expect(cheap).toEqual({ item1: 10, item3: 5 })
  })

  it('should handle empty object', () => {
    const [pass, fail] = partitionObject({}, (value) => true)
    
    expect(pass).toEqual({})
    expect(fail).toEqual({})
  })

  it('should handle all items passing', () => {
    const data = { a: 1, b: 2, c: 3 }
    const [pass, fail] = partitionObject(data, (value) => value > 0)
    
    expect(pass).toEqual({ a: 1, b: 2, c: 3 })
    expect(fail).toEqual({})
  })

  it('should handle all items failing', () => {
    const data = { a: 1, b: 2, c: 3 }
    const [pass, fail] = partitionObject(data, (value) => value > 10)
    
    expect(pass).toEqual({})
    expect(fail).toEqual({ a: 1, b: 2, c: 3 })
  })

  it('should work with complex nested structures', () => {
    const products = {
      prod1: { name: 'Apple', category: 'fruit', price: 2 },
      prod2: { name: 'Carrot', category: 'vegetable', price: 1 },
      prod3: { name: 'Banana', category: 'fruit', price: 3 }
    }
    const [fruits, others] = partitionObject(
      products,
      (product) => product.category === 'fruit'
    )
    
    expect(fruits).toEqual({
      prod1: { name: 'Apple', category: 'fruit', price: 2 },
      prod3: { name: 'Banana', category: 'fruit', price: 3 }
    })
    expect(others).toEqual({
      prod2: { name: 'Carrot', category: 'vegetable', price: 1 }
    })
  })
})
