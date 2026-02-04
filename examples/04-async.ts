/**
 * Example 04: Async Utilities
 * 
 * Handle async operations, errors, and concurrency.
 */

import { sleep, retry, debounce, throttle, once } from '../src/async'
import { awaitTo } from '../src/async/awaitTo'

// ============================================
// Sleep
// ============================================

async function sleepExample() {
  console.log('=== Sleep ===')
  console.log('Starting...')
  await sleep(500)
  console.log('500ms passed')
}

// ============================================
// Error Handling with awaitTo
// ============================================

async function awaitToExample() {
  console.log('\n=== awaitTo ===')

  async function fetchUser(id: number) {
    if (id < 0) throw new Error('Invalid ID')
    return { name: 'Alice' }
  }

  // Clean error handling without try/catch
  const [error, user] = await awaitTo(fetchUser(1))
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('User:', user)
  }

  // Handle error case
  const [err] = await awaitTo(fetchUser(-1))
  if (err) console.log('Caught:', err.message)
}

// ============================================
// Retry
// ============================================

async function retryExample() {
  console.log('\n=== Retry ===')

  let attempts = 0

  async function flakyApi(): Promise<string> {
    attempts++
    console.log(`Attempt ${attempts}...`)
    if (attempts < 3) throw new Error('Failed')
    return 'Success!'
  }

  const result = await retry(flakyApi, {
    attempts: 5,
    delay: 100,
  })
  console.log('Result:', result)
}

// ============================================
// Debounce
// ============================================

function debounceExample() {
  console.log('\n=== Debounce ===')

  let count = 0
  const search = debounce((q: string) => {
    count++
    console.log(`Search: "${q}" (call #${count})`)
  }, 200)

  // Rapid calls - only last executes
  search('h')
  search('he')
  search('hel')
  search('hello')

  setTimeout(() => console.log(`Total calls: ${count}`), 300)
}

// ============================================
// Throttle
// ============================================

function throttleExample() {
  console.log('\n=== Throttle ===')

  let count = 0
  const save = throttle(() => {
    count++
    console.log(`Save #${count}`)
  }, 100)

  // Frequent calls - throttled
  const interval = setInterval(save, 20)
  setTimeout(() => {
    clearInterval(interval)
    console.log(`Total saves: ${count}`)
  }, 500)
}

// ============================================
// Once
// ============================================

function onceExample() {
  console.log('\n=== Once ===')

  let count = 0
  const init = once(() => {
    count++
    console.log(`Init #${count}`)
    return { ready: true }
  })

  console.log('1st:', init())
  console.log('2nd:', init())
  console.log('3rd:', init())
  console.log(`Total inits: ${count}`)  // 1
}

// ============================================
// Run All
// ============================================

async function main() {
  await sleepExample()
  await awaitToExample()
  await retryExample()
  debounceExample()
  await sleep(400)
  throttleExample()
  await sleep(600)
  onceExample()
}

main().catch(console.error)
