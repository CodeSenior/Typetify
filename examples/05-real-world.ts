/**
 * Example 05: Real-World Scenarios
 * 
 * Practical examples combining multiple typetify utilities.
 */

import { isString, isNumber, isObject } from '../src/guards'
import { groupBy, sortBy, partition, chunk } from '../src/collection'
import { pick, omit, mapObject } from '../src/object'
import { pipe, compose } from '../src/flow'
import { get, getOr, ifElse, coalesce, when } from '../src/logic'
import { createIterator } from '../src/iterator'

// ============================================
// Scenario 1: API Response Processing
// ============================================

console.log('=== API Response Processing ===')

interface ApiUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  lastLogin: string | null
  metadata: { preferences?: { theme?: string } }
}

const apiResponse: ApiUser[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', lastLogin: '2024-01-15', metadata: { preferences: { theme: 'dark' } } },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', lastLogin: null, metadata: {} },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user', lastLogin: '2024-01-10', metadata: { preferences: { theme: 'light' } } },
  { id: 4, name: 'Diana', email: 'diana@example.com', role: 'guest', lastLogin: '2024-01-12', metadata: {} },
]

// Process users with type-safe utilities
const processedUsers = createIterator(apiResponse)
  .map(user => ({
    ...pick(user, ['id', 'name', 'email', 'role']),
    theme: getOr(user, 'system', 'metadata', 'preferences', 'theme'),
    hasLoggedIn: user.lastLogin !== null,
  }))
  .toArray()

console.log('Processed users:', processedUsers)

// Group by role
const byRole = groupBy(apiResponse, u => u.role)
console.log('Admins:', byRole.admin?.map(u => u.name))
console.log('Users:', byRole.user?.map(u => u.name))

// ============================================
// Scenario 2: Form Validation
// ============================================

console.log('\n=== Form Validation ===')

interface FormData {
  username: unknown
  email: unknown
  age: unknown
}

function validateForm(data: FormData) {
  const errors: string[] = []

  when(!isString(data.username), () => errors.push('Username must be a string'))
  when(isString(data.username) && data.username.length < 3, () => errors.push('Username too short'))
  
  when(!isString(data.email), () => errors.push('Email must be a string'))
  when(isString(data.email) && !data.email.includes('@'), () => errors.push('Invalid email'))
  
  when(!isNumber(data.age), () => errors.push('Age must be a number'))
  when(isNumber(data.age) && (data.age < 0 || data.age > 150), () => errors.push('Invalid age'))

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? {
      username: data.username as string,
      email: data.email as string,
      age: data.age as number,
    } : null
  }
}

console.log('Valid:', validateForm({ username: 'alice', email: 'alice@test.com', age: 25 }))
console.log('Invalid:', validateForm({ username: 'ab', email: 'invalid', age: -5 }))

// ============================================
// Scenario 3: Data Transformation Pipeline
// ============================================

console.log('\n=== Data Pipeline ===')

interface RawProduct {
  product_name: string
  product_price: number
  product_category: string
  in_stock: boolean
}

const rawProducts: RawProduct[] = [
  { product_name: 'iPhone', product_price: 999, product_category: 'electronics', in_stock: true },
  { product_name: 'MacBook', product_price: 1999, product_category: 'electronics', in_stock: true },
  { product_name: 'Shirt', product_price: 49, product_category: 'clothing', in_stock: false },
  { product_name: 'Jeans', product_price: 79, product_category: 'clothing', in_stock: true },
  { product_name: 'Headphones', product_price: 299, product_category: 'electronics', in_stock: true },
]

// Transform pipeline
const catalog = pipe(
  rawProducts,
  // Filter in-stock only
  (products) => products.filter(p => p.in_stock),
  // Transform to clean format
  (products) => products.map(p => ({
    name: p.product_name,
    price: p.product_price,
    priceFormatted: `$${p.product_price.toFixed(2)}`,
    category: p.product_category,
  })),
  // Sort by price
  (products) => sortBy(products, p => p.price),
)

console.log('Catalog:', catalog)

// ============================================
// Scenario 4: Pagination
// ============================================

console.log('\n=== Pagination ===')

const allItems = Array.from({ length: 47 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }))
const pageSize = 10

const pages = chunk(allItems, pageSize)
console.log(`Total items: ${allItems.length}`)
console.log(`Total pages: ${pages.length}`)
console.log(`Page 1:`, pages[0]?.map(i => i.name).join(', '))
console.log(`Page 5 (last):`, pages[4]?.map(i => i.name).join(', '))

// ============================================
// Scenario 5: Config Management
// ============================================

console.log('\n=== Config Management ===')

interface AppConfig {
  apiUrl: string
  timeout: number
  retries: number
  debug: boolean
  features: { darkMode: boolean; notifications: boolean }
}

const defaultConfig: AppConfig = {
  apiUrl: 'https://api.example.com',
  timeout: 5000,
  retries: 3,
  debug: false,
  features: { darkMode: false, notifications: true },
}

const envConfig = {
  apiUrl: process.env.API_URL,
  timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : undefined,
  debug: process.env.DEBUG === 'true',
}

// Merge with defaults using coalesce
const finalConfig: AppConfig = {
  apiUrl: coalesce(envConfig.apiUrl, defaultConfig.apiUrl) as string,
  timeout: coalesce(envConfig.timeout, defaultConfig.timeout) as number,
  retries: defaultConfig.retries,
  debug: envConfig.debug || defaultConfig.debug,
  features: defaultConfig.features,
}

console.log('Final config:', finalConfig)

// ============================================
// Scenario 6: Statistics
// ============================================

console.log('\n=== Statistics ===')

const sales = [
  { product: 'A', amount: 100, region: 'North' },
  { product: 'B', amount: 200, region: 'South' },
  { product: 'A', amount: 150, region: 'South' },
  { product: 'C', amount: 300, region: 'North' },
  { product: 'B', amount: 250, region: 'North' },
]

// Group and aggregate
const byRegion = groupBy(sales, s => s.region)
const regionTotals = mapObject(byRegion, (regionSales) => 
  regionSales.reduce((sum, s) => sum + s.amount, 0)
)
console.log('Sales by region:', regionTotals)

const byProduct = groupBy(sales, s => s.product)
const productTotals = mapObject(byProduct, (productSales) =>
  productSales.reduce((sum, s) => sum + s.amount, 0)
)
console.log('Sales by product:', productTotals)

// Partition high/low performers
const [highSales, lowSales] = partition(sales, s => s.amount >= 200)
console.log('High sales:', highSales.length)
console.log('Low sales:', lowSales.length)
