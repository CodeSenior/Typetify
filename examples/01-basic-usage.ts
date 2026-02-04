/**
 * Example 01: Basic Usage
 * 
 * Demonstrates core typetify utilities for everyday use.
 */

import { isString, isNumber, isArray, isObject, isFunction, isEmpty } from '../src/guards'
import { chunk, groupBy, sortBy, partition, take, drop, unique, first, last } from '../src/collection'
import { pick, omit, mapObject, filterObject, keysTyped } from '../src/object'

// ============================================
// Type Guards
// ============================================

console.log('=== Type Guards ===')

function processValue(value: unknown): string {
  if (isString(value)) return value.toUpperCase()
  if (isNumber(value)) return value.toFixed(2)
  if (isArray(value)) return `Array[${value.length}]`
  return 'Unknown'
}

console.log(processValue('hello'))    // HELLO
console.log(processValue(42.5))       // 42.50
console.log(processValue([1, 2, 3]))  // Array[3]

// Filter arrays by type
const mixed = ['a', 1, 'b', 2, 'c', 3]
const strings = mixed.filter(isString)
const numbers = mixed.filter(isNumber)
console.log('Strings:', strings)  // ['a', 'b', 'c']
console.log('Numbers:', numbers)  // [1, 2, 3]

// ============================================
// Collection Utilities
// ============================================

console.log('\n=== Collections ===')

// Chunk array
const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log('Chunks of 3:', chunk(nums, 3))
// [[1,2,3], [4,5,6], [7,8,9], [10]]

// Group by
interface Product {
  name: string
  category: string
  price: number
}

const products: Product[] = [
  { name: 'iPhone', category: 'Electronics', price: 999 },
  { name: 'MacBook', category: 'Electronics', price: 1999 },
  { name: 'Shirt', category: 'Clothing', price: 49 },
]

const byCategory = groupBy(products, p => p.category)
console.log('By category:', byCategory)

// Sort by
const sorted = sortBy(products, p => p.price)
console.log('By price:', sorted.map(p => p.name))

// Partition
const [expensive, cheap] = partition(products, p => p.price > 500)
console.log('Expensive:', expensive.map(p => p.name))
console.log('Cheap:', cheap.map(p => p.name))

// Take and Drop
console.log('Take 3:', take(nums, 3))   // [1, 2, 3]
console.log('Drop 3:', drop(nums, 3))   // [4, 5, 6, 7, 8, 9, 10]

// Unique
const dupes = [1, 2, 2, 3, 3, 3]
console.log('Unique:', unique(dupes))   // [1, 2, 3]

// First and Last
console.log('First:', first(nums))  // 1
console.log('Last:', last(nums))    // 10

// ============================================
// Object Utilities
// ============================================

console.log('\n=== Objects ===')

interface User {
  id: number
  name: string
  email: string
  password: string
}

const user: User = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  password: 'secret',
}

// Pick specific keys
const publicUser = pick(user, ['id', 'name', 'email'])
console.log('Public:', publicUser)

// Omit sensitive keys
const safeUser = omit(user, ['password'])
console.log('Safe:', safeUser)

// Map object values
const prices = { apple: 1.5, banana: 0.75, orange: 2.0 }
const withTax = mapObject(prices, price => price * 1.1)
console.log('With tax:', withTax)

// Filter object
const scores = { alice: 85, bob: 72, charlie: 91 }
const passing = filterObject(scores, score => score >= 80)
console.log('Passing:', passing)

// Typed keys
const keys = keysTyped(user)
console.log('Keys:', keys)  // ['id', 'name', 'email', 'password']
