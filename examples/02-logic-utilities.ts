/**
 * Example 02: Logic Utilities
 * 
 * Replace ternaries, logical operators, and optional chaining
 * with cleaner, more readable alternatives.
 */

import {
  when, whenValue, ifElse, cond, matchValue,
  and, or, coalesce, defaultTo,
  get, getOr, tryGet, chain, optional
} from '../src/logic'

// ============================================
// Replacing && for conditional execution
// ============================================

console.log('=== when / unless ===')

const isAdmin = true

// Before: isAdmin && console.log('Admin!')
// After:
when(isAdmin, () => console.log('Admin panel visible'))

// Get value conditionally
const badge = whenValue(isAdmin, 'Admin Badge')
console.log('Badge:', badge)

// ============================================
// Replacing ternary operator
// ============================================

console.log('\n=== ifElse ===')

const isOnline = true

// Before: isOnline ? 'Online' : 'Offline'
// After:
const status = ifElse(isOnline, 'Online', 'Offline')
console.log('Status:', status)

// ============================================
// Replacing nested ternaries
// ============================================

console.log('\n=== cond ===')

const score = 85

// Before: score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : 'F'
// After:
const grade = cond(
  [score >= 90, 'A'],
  [score >= 80, 'B'],
  [score >= 70, 'C'],
  [true, 'F']
)
console.log(`Score ${score} = Grade ${grade}`)

// ============================================
// Pattern matching
// ============================================

console.log('\n=== matchValue ===')

type Status = 'pending' | 'success' | 'error'
const currentStatus: Status = 'success'

const message = matchValue<Status, string>(currentStatus, {
  pending: 'Loading...',
  success: 'Done!',
  error: 'Failed!',
})
console.log('Message:', message)

// ============================================
// Replacing || and &&
// ============================================

console.log('\n=== and / or ===')

// Before: a || b || c || 'default'
// After:
const name = or(null, '', undefined, 'Alice')
console.log('Name:', name)

// ============================================
// Replacing ?? (nullish coalescing)
// ============================================

console.log('\n=== coalesce / defaultTo ===')

// coalesce handles 0 and '' correctly (unlike ||)
const timeout = coalesce(0, null, 5000)
console.log('Timeout:', timeout)  // 0 (not 5000!)

const retries = defaultTo(null, 3)
console.log('Retries:', retries)  // 3

// ============================================
// Replacing optional chaining
// ============================================

console.log('\n=== get / getOr ===')

const user = {
  name: 'Alice',
  address: { city: 'Paris' }
}

// Before: user?.address?.city
// After:
const city = get(user, 'address', 'city')
console.log('City:', city)

// Before: user?.address?.country ?? 'Unknown'
// After:
const country = getOr(user, 'Unknown', 'address', 'country')
console.log('Country:', country)

// ============================================
// Try/catch simplified
// ============================================

console.log('\n=== tryGet ===')

const validJson = '{"name": "Alice"}'
const invalidJson = 'not json'

const parsed1 = tryGet(() => JSON.parse(validJson))
const parsed2 = tryGet(() => JSON.parse(invalidJson))

console.log('Valid:', parsed1)    // { name: 'Alice' }
console.log('Invalid:', parsed2)  // undefined

// ============================================
// Chaining operations
// ============================================

console.log('\n=== chain ===')

const data = { profile: { settings: { theme: 'dark' } } }

const theme = chain(data)
  .map(d => d.profile)
  .map(p => p.settings)
  .map(s => s.theme)
  .map(t => t.toUpperCase())
  .valueOr('LIGHT')

console.log('Theme:', theme)  // 'DARK'

// ============================================
// Optional function calls
// ============================================

console.log('\n=== optional ===')

const arr: number[] | null = [1, 2, 3]

// Before: arr?.map(x => x * 2)
// After:
const doubled = optional(arr, a => a.map(x => x * 2))
console.log('Doubled:', doubled)  // [2, 4, 6]
