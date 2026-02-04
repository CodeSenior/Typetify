/**
 * Solutions to TypeScript pain points identified by Gemini
 * 
 * This file demonstrates how Typetify solves the 6 main pain points
 * TypeScript developers run into.
 */

// ============================================================================
// PAIN POINT 1: Type narrowing that evaporates
// Problem: users.filter(u => !!u) still returns (User | null)[]
// ============================================================================

import {
  // Narrowing
  filterDefined,
  filterTruthy,
  filterByGuard,
  partitionByGuard,
  assertDefined,
  narrowUnion,
  switchUnion,
  excludeNullish,
  withDefault,
  mapNullable,
  // Type guard combinators
  oneOf,
  allOf,
  not,
  arrayOf,
  objectOf,
  literal,
  optional,
  nullable,
} from '../src/narrowing'

import { isString, isNumber } from '../src/guards'

// ❌ AVANT: Le type reste (User | null | undefined)[]
interface User {
  id: number
  name: string
  role: 'admin' | 'user'
}

const usersWithNulls: (User | null | undefined)[] = [
  { id: 1, name: 'Alice', role: 'admin' },
  null,
  { id: 2, name: 'Bob', role: 'user' },
  undefined,
]

// ✅ AFTER: The type is properly narrowed to User[]
const users = filterDefined(usersWithNulls)
// Type: User[]

// With falsy values
const mixedValues = ['hello', '', 0, null, 'world', false, 42]
const truthyValues = filterTruthy(mixedValues)
// Type: (string | number)[] - without falsy values!

// With a custom type guard
const isAdmin = (u: User): u is User & { role: 'admin' } => u.role === 'admin'
const admins = filterByGuard(users, isAdmin)
// Type: (User & { role: 'admin' })[]

// Partition: split into two typed groups
const [adminUsers, regularUsers] = partitionByGuard(users, isAdmin)
// adminUsers: (User & { role: 'admin' })[]
// regularUsers: User[]

console.log('Pain Point 1 - Narrowing:', { users, truthyValues, admins })

// ============================================================================
// PAIN POINT 2: try/catch that loses types
// Problem: in catch(e), e is typed as unknown
// ============================================================================

import { tryCatch, tryCatchAsync } from '../src/flow'
import { awaitTo } from '../src/async'
import { ok, err, matchResult, andThen, type Result } from '../src/result'

// ❌ BEFORE: try/catch with unknown
function riskyOld(input: string): number {
  try {
    return JSON.parse(input)
  } catch (e) {
    // e is unknown - we need manual checks
    if (e instanceof Error) {
      console.error(e.message)
    }
    return 0
  }
}

// ✅ AFTER: Result<T, Error> with full type safety
function riskyNew(input: string): Result<number, Error> {
  return tryCatch(() => JSON.parse(input))
}

const result = riskyNew('42')
const value = matchResult(result, {
  ok: (n) => `Parsed: ${n}`,
  err: (e) => `Error: ${e.message}`, // e is typed as Error!
})

// Chaining without try/catch
function parseAndDouble(input: string): Result<number, Error> {
  return andThen(
    tryCatch(() => JSON.parse(input)),
    (n) => typeof n === 'number' ? ok(n * 2) : err(new Error('Not a number'))
  )
}

// Async with awaitTo (tuple pattern)
async function fetchUserSafe(id: number) {
  const [error, user] = await awaitTo(fetch(`/api/users/${id}`).then(r => r.json()))
  
  if (error) {
    // error is typed as Error
    console.error('Fetch failed:', error.message)
    return null
  }
  
  // user is typed (not unknown!)
  return user
}

console.log('Pain Point 2 - Try/Catch:', value)

// ============================================================================
// PAIN POINT 3: Object.keys/entries that return string[]
// Problem: Object.keys(obj) returns string[] instead of (keyof T)[]
// ============================================================================

import { keysTyped, entriesTyped, valuesTyped } from '../src/object'

const config = {
  host: 'localhost',
  port: 3000,
  debug: true,
} as const

// ❌ BEFORE: Object.keys returns string[]
// const keys = Object.keys(config) // string[]
// config[keys[0]] // Error: string can't index config

// ✅ AFTER: keysTyped returns (keyof T)[]
const keys = keysTyped(config)
// Type: ('host' | 'port' | 'debug')[]

for (const key of keys) {
  const value = config[key] // No error!
  console.log(`${key}: ${value}`)
}

// entriesTyped with correct types
for (const [key, value] of entriesTyped(config)) {
  // key: 'host' | 'port' | 'debug'
  // value: string | number | boolean
  console.log(`${key} = ${value}`)
}

console.log('Pain Point 3 - Object.keys:', keys)

// ============================================================================
// PAIN POINT 4: Deep Path Access (user.profile.settings.theme)
// Problem: Type-safe access to nested properties
// ============================================================================

import { deepGet, deepGetOr, deepSet, deepHas, deepPluck } from '../src/object'

interface AppConfig {
  user: {
    profile: {
      name: string
      settings: {
        theme: 'light' | 'dark'
        notifications: boolean
      }
    }
    preferences?: {
      language: string
    }
  }
  api: {
    baseUrl: string
    timeout: number
  }
}

const appConfig: AppConfig = {
  user: {
    profile: {
      name: 'Alice',
      settings: {
        theme: 'dark',
        notifications: true,
      },
    },
  },
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
  },
}

// ❌ BEFORE: Verbose access with optional chaining
// const theme = appConfig?.user?.profile?.settings?.theme

// ✅ AFTER: deepGet with autocomplete and type inference
const theme = deepGet(appConfig, 'user.profile.settings.theme')
// Type: 'light' | 'dark'

// For optional properties, deepGet returns undefined if the path doesn't exist
const preferences = deepGet(appConfig, 'user.preferences')
// Type: { language: string } | undefined

// With a default value
const safeTimeout = deepGetOr(appConfig, 'api.timeout', 3000)
// Type: number (jamais undefined)

// Check existence
if (deepHas(appConfig, 'user.preferences')) {
  console.log('Preferences are set')
}

// Immutable setter
const updatedConfig = deepSet(appConfig, 'user.profile.settings.theme', 'light')
// Returns a new object, the original is unchanged

// Pluck on an array
const allUsers: AppConfig[] = [appConfig, appConfig]
const allThemes = deepPluck(allUsers, 'user.profile.settings.theme')
// Type: ('light' | 'dark')[]

console.log('Pain Point 4 - Deep Path:', { theme, safeTimeout })

// ============================================================================
// PAIN POINT 5: JSON.parse returning any
// Problem: No guarantee the API returns the right fields
// ============================================================================

import {
  object,
  string,
  number,
  boolean,
  array,
  optional as optionalSchema,
  union,
  literal as literalSchema,
  email,
  safeParse,
  parse,
  is,
  parseJson,
  type Infer,
} from '../src/schema'

// Define a validation schema
const UserSchema = object({
  id: number(),
  name: string(),
  email: email(),
  role: union([literalSchema('admin'), literalSchema('user')]),
  settings: object({
    theme: union([literalSchema('light'), literalSchema('dark')]),
    notifications: boolean(),
  }),
  tags: array(string()),
})

// Infer the TypeScript type from the schema
type ValidatedUser = Infer<typeof UserSchema>
// Type: {
//   id: number
//   name: string
//   email: string
//   role: 'admin' | 'user'
//   settings: { theme: 'light' | 'dark'; notifications: boolean }
//   tags: string[]
// }

// ❌ BEFORE: JSON.parse returns any
// const user = JSON.parse(jsonString) as User // Dangereux!

// ✅ AFTER: Runtime validation with types
const jsonString = `{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "role": "admin",
  "settings": { "theme": "dark", "notifications": true },
  "tags": ["developer", "typescript"]
}`

// Safe parse with Result
const parseResult = parseJson(UserSchema, jsonString)

if (parseResult.ok) {
  const user = parseResult.value
  // user is fully typed and validated!
  console.log(`Welcome ${user.name} (${user.role})`)
} else {
  // Detailed errors with paths
  for (const error of parseResult.error) {
    console.error(`${error.path.join('.')}: ${error.message}`)
  }
}

// Type guard with schema
function processApiResponse(data: unknown) {
  if (is(UserSchema, data)) {
    // data is now ValidatedUser
    console.log(data.email)
  }
}

// Parse that throws (for cases where you want an exception)
try {
  const user = parse(UserSchema, JSON.parse(jsonString))
  console.log(user.name)
} catch (e) {
  console.error('Validation failed')
}

console.log('Pain Point 5 - JSON Validation:', parseResult.ok ? 'Valid!' : 'Invalid')

// ============================================================================
// PAIN POINT 6: Discriminated unions and exhaustive checks
// ============================================================================

type ApiResponse =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; message: string }

function handleResponse(response: ApiResponse): string {
  // ✅ narrowUnion for discriminated unions
  if (narrowUnion(response, 'status', 'success')) {
    // response est { status: 'success'; data: User[] }
    return `Loaded ${response.data.length} users`
  }
  
  if (narrowUnion(response, 'status', 'error')) {
    return `Error: ${response.message}`
  }
  
  return 'Loading...'
}

const apiResponse: ApiResponse = { status: 'success', data: users }
const message = handleResponse(apiResponse)

console.log('Pain Point 6 - Discriminated Unions:', message)

// ============================================================================
// BONUS: Type guard combinators
// ============================================================================

// Create complex guards by composition
const isStringOrNumber = oneOf(isString, isNumber)
const isNotNull = not((v: unknown): v is null => v === null)

// Guard for typed arrays
const isStringArray = arrayOf(isString)

// Guard for objects with a shape
const isUserShape = objectOf({
  id: isNumber,
  name: isString,
})

// Usage
const testData = { id: 1, name: 'Test' }
if (isUserShape(testData)) {
  // testData is validated as { id: number; name: string }
  console.log(testData.name)
}

console.log('Bonus - Guard Combinators: Working!')

// ============================================================================
// SUMMARY: Typetify turns uncertain types into reliable ones
// ============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    TYPETIFY PAIN POINTS SOLUTIONS                 ║
╠══════════════════════════════════════════════════════════════════╣
║ 1. Type Narrowing    → filterDefined, filterTruthy, filterByGuard║
║ 2. Try/Catch         → tryCatch, Result<T,E>, awaitTo            ║
║ 3. Object.keys       → keysTyped, entriesTyped, valuesTyped      ║
║ 4. Deep Path Access  → deepGet, deepSet, deepHas (type-safe!)    ║
║ 5. JSON Validation   → Schema validation with type inference     ║
║ 6. Discriminated     → narrowUnion, switchUnion, exhaustiveCheck ║
╚══════════════════════════════════════════════════════════════════╝
`)
