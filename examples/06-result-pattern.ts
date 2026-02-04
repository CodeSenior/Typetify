/**
 * Result/Option Pattern Examples
 * 
 * Demonstrates how to use the unified Result<T, E> and Option<T> types
 * for error handling without try/catch blocks.
 */

import {
  ok,
  err,
  some,
  none,
  type Result,
  type Option,
  andThen,
  mapResult,
  mapErr,
  orElse,
  matchResult,
  matchOption,
  isOk,
  unwrapOr,
  fromNullable,
  safeJsonParse,
  tryCatch,
} from '../src'

// ============================================================================
// Basic Result Usage
// ============================================================================

interface User {
  id: number
  name: string
  email: string
}

function findUser(id: number): Result<User, string> {
  if (id === 1) {
    return ok({ id: 1, name: 'Alice', email: 'alice@example.com' })
  }
  return err(`User ${id} not found`)
}

// Simple pattern matching
const user1 = findUser(1)
const message1 = matchResult(user1, {
  ok: (user) => `Found: ${user.name}`,
  err: (error) => `Error: ${error}`,
})
console.log(message1) // "Found: Alice"

// Type guard usage
if (isOk(user1)) {
  console.log(user1.value.email) // TypeScript knows this is safe
}

// ============================================================================
// Chaining Operations with andThen (flatMap)
// ============================================================================

function validateEmail(user: User): Result<User, string> {
  if (user.email.includes('@')) {
    return ok(user)
  }
  return err('Invalid email format')
}

function saveUser(user: User): Result<User, string> {
  console.log(`Saving user: ${user.name}`)
  return ok(user)
}

// Chain multiple operations that can fail
const result = andThen(
  andThen(findUser(1), validateEmail),
  saveUser
)

// Or using a more functional approach
function processUser(id: number): Result<User, string> {
  return andThen(
    andThen(findUser(id), validateEmail),
    saveUser
  )
}

// ============================================================================
// Transforming Results with mapResult
// ============================================================================

const userResult = findUser(1)
const nameResult = mapResult(userResult, (user) => user.name.toUpperCase())
// Result<string, string>

console.log(unwrapOr(nameResult, 'Unknown')) // "ALICE"

// ============================================================================
// Error Transformation with mapErr
// ============================================================================

interface AppError {
  code: string
  message: string
}

const detailedError = mapErr(findUser(999), (error) => ({
  code: 'USER_NOT_FOUND',
  message: error,
}))
// Result<User, AppError>

// ============================================================================
// Fallback with orElse
// ============================================================================

function getDefaultUser(): Result<User, string> {
  return ok({ id: 0, name: 'Guest', email: 'guest@example.com' })
}

const userOrDefault = orElse(findUser(999), () => getDefaultUser())
// Always succeeds with either the found user or default

// ============================================================================
// Real-world Example: API Request Pipeline
// ============================================================================

interface ApiResponse {
  data: unknown
  status: number
}

function fetchData(url: string): Result<ApiResponse, Error> {
  // Simulated fetch
  if (url.startsWith('http')) {
    return ok({ data: { users: [] }, status: 200 })
  }
  return err(new Error('Invalid URL'))
}

function parseResponse(response: ApiResponse): Result<unknown, Error> {
  if (response.status === 200) {
    return ok(response.data)
  }
  return err(new Error(`HTTP ${response.status}`))
}

function validateData(data: unknown): Result<User[], Error> {
  if (Array.isArray(data)) {
    return ok(data as User[])
  }
  return err(new Error('Invalid data format'))
}

// Complete pipeline without try/catch
function getUsersFromApi(url: string): Result<User[], Error> {
  return andThen(
    andThen(fetchData(url), parseResponse),
    validateData
  )
}

const apiResult = getUsersFromApi('https://api.example.com/users')
const users = matchResult(apiResult, {
  ok: (users) => {
    console.log(`Loaded ${users.length} users`)
    return users
  },
  err: (error) => {
    console.error('Failed to load users:', error.message)
    return []
  },
})

// ============================================================================
// JSON Parsing with Result
// ============================================================================

const jsonString = '{"name": "Bob", "age": 30}'
const parseResult = safeJsonParse<{ name: string; age: number }>(jsonString)

const greeting = matchResult(parseResult, {
  ok: (data) => `Hello, ${data.name}!`,
  err: (error) => `Parse error: ${error.message}`,
})

// Chain JSON parsing with validation
function parseAndValidateUser(json: string): Result<User, Error> {
  return andThen(safeJsonParse<Partial<User>>(json), (data) => {
    if (data.id && data.name && data.email) {
      return ok(data as User)
    }
    return err(new Error('Missing required fields'))
  })
}

// ============================================================================
// Option Type for Nullable Values
// ============================================================================

function findInArray<T>(arr: T[], predicate: (item: T) => boolean): Option<T> {
  const found = arr.find(predicate)
  return fromNullable(found)
}

const numbers = [1, 2, 3, 4, 5]
const evenNumber = findInArray(numbers, (n) => n % 2 === 0)

const result2 = matchOption(evenNumber, {
  some: (n) => `Found: ${n}`,
  none: () => 'Not found',
})

// ============================================================================
// Combining tryCatch with Result
// ============================================================================

function riskyOperation(input: string): number {
  if (input === 'throw') {
    throw new Error('Boom!')
  }
  return parseInt(input, 10)
}

const safeResult = tryCatch(() => riskyOperation('42'))
const doubled = mapResult(safeResult, (n) => n * 2)

console.log(unwrapOr(doubled, 0)) // 84

// Error case
const errorResult = tryCatch(() => riskyOperation('throw'))
console.log(
  matchResult(errorResult, {
    ok: (n) => `Success: ${n}`,
    err: (e) => `Error: ${e.message}`,
  })
)

// ============================================================================
// Advanced: Combining Multiple Results
// ============================================================================

function combineResults<T, E>(
  results: Result<T, E>[]
): Result<T[], E> {
  const values: T[] = []
  
  for (const result of results) {
    if (result.ok) {
      values.push(result.value)
    } else {
      return result // Return first error
    }
  }
  
  return ok(values)
}

const multipleResults = [
  findUser(1),
  findUser(2),
  findUser(3),
]

const combined = combineResults(multipleResults)
// Result<User[], string>

// ============================================================================
// Type-safe Error Handling
// ============================================================================

type ValidationError = { type: 'validation'; field: string }
type NetworkError = { type: 'network'; statusCode: number }
type AppErrors = ValidationError | NetworkError

function validateAge(age: number): Result<number, ValidationError> {
  if (age >= 0 && age <= 120) {
    return ok(age)
  }
  return err({ type: 'validation', field: 'age' })
}

const ageResult = validateAge(150)
const errorMessage = matchResult(ageResult, {
  ok: (age) => `Valid age: ${age}`,
  err: (error) => {
    switch (error.type) {
      case 'validation':
        return `Validation failed for field: ${error.field}`
    }
  },
})

console.log(errorMessage)
