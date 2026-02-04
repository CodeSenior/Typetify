/**
 * Example 03: Lazy Iterators
 * 
 * Process large datasets efficiently with lazy evaluation.
 */

import {
  createIterator,
  lazyRange,
  lazyMap,
  lazyFilter,
  lazyTake,
  lazyChunk,
  enumerate,
  cycle,
  repeat,
  lazyZip,
} from '../src/iterator'

// ============================================
// Basic Iterator
// ============================================

console.log('=== Basic Iterator ===')

const numbers = createIterator([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

// Chain operations - nothing computed until toArray()
const result = numbers
  .filter(n => n % 2 === 0)  // Keep even
  .map(n => n * n)           // Square
  .take(3)                   // First 3

console.log('Even squares:', result.toArray())  // [4, 16, 36]

// ============================================
// Lazy Range
// ============================================

console.log('\n=== Lazy Range ===')

const range = lazyRange(1, 11)
console.log('1-10:', range.toArray())

const evens = lazyRange(0, 20, 2)
console.log('Evens:', evens.toArray())

// ============================================
// Processing Large Data
// ============================================

console.log('\n=== Large Dataset ===')

// Find first 5 numbers divisible by 7 and 11
const huge = lazyRange(1, 1_000_001)
const divisible = huge
  .filter(n => n % 7 === 0 && n % 11 === 0)
  .take(5)

console.log('Divisible by 7 and 11:', divisible.toArray())

// ============================================
// Enumerate
// ============================================

console.log('\n=== Enumerate ===')

const fruits = ['apple', 'banana', 'cherry']
for (const [i, fruit] of enumerate(fruits)) {
  console.log(`${i}: ${fruit}`)
}

// ============================================
// Chunk
// ============================================

console.log('\n=== Chunk ===')

const data = lazyRange(1, 11)
console.log('Chunked:', lazyChunk(data, 3).toArray())

// ============================================
// Zip
// ============================================

console.log('\n=== Zip ===')

const names = ['Alice', 'Bob', 'Charlie']
const scores = [95, 87, 92]
console.log('Zipped:', lazyZip(names, scores).toArray())

// ============================================
// Cycle and Repeat
// ============================================

console.log('\n=== Cycle & Repeat ===')

const colors = ['red', 'green', 'blue']
console.log('Cycled:', cycle(colors).take(7).toArray())

console.log('Repeated:', repeat('x', 5).toArray())

// ============================================
// Complex Pipeline
// ============================================

console.log('\n=== Complex Pipeline ===')

interface User {
  name: string
  age: number
  active: boolean
}

const users: User[] = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 30, active: false },
  { name: 'Charlie', age: 35, active: true },
  { name: 'Diana', age: 28, active: true },
]

const activeAdults = createIterator(users)
  .filter(u => u.active)
  .filter(u => u.age > 25)
  .map(u => u.name)
  .take(2)

console.log('Active adults:', activeAdults.toArray())

// ============================================
// Reduce
// ============================================

console.log('\n=== Reduce ===')

const sum = createIterator([1, 2, 3, 4, 5])
  .reduce((acc, n) => acc + n, 0)
console.log('Sum:', sum)

// ============================================
// First, Last, Count
// ============================================

console.log('\n=== First, Last, Count ===')

const nums = createIterator([10, 20, 30, 40, 50])
console.log('First:', nums.first())
console.log('Last:', createIterator([10, 20, 30]).last())
console.log('Count:', createIterator([1, 2, 3, 4, 5]).count())
