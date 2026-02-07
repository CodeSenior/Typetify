<div align="center">

# Typetify

[![npm version](https://img.shields.io/npm/v/typetify?style=flat-square&color=blue)](https://www.npmjs.com/package/typetify)
[![license](https://img.shields.io/npm/l/typetify?style=flat-square&color=green)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![npm downloads](https://img.shields.io/npm/dm/typetify?style=flat-square&color=orange)](https://www.npmjs.com/package/typetify)
[![bundle size](https://img.shields.io/bundlephobia/minzip/typetify?style=flat-square&color=purple)](https://bundlephobia.com/package/typetify)

**Runtime TypeScript helpers — like Lodash, but TS-first**

TypeScript is powerful, but it doesn't protect you at runtime. **Typetify** fills this gap with type-safe utilities that work when it matters most.

<img src="https://typetify.hosby.io/typetify-1.png" alt="Typetify Logo" width="300" />

[Documentation](https://typetify.hosby.io)
</div>

---

## Features

<table>
<tr>
<td width="50%">

### Runtime Safety
Guards and assertions that protect you when TypeScript can't — at runtime, where it matters.

</td>
<td width="50%">

### Perfect Types
IntelliSense that actually helps. Every function is designed for maximum type inference.

</td>
</tr>
<tr>
<td width="50%">

### Zero Dependencies
Lightweight and tree-shakable. Only bundle what you use.

</td>
<td width="50%">

### No Magic
Boring, predictable API. No config, no setup, just functions that work.

</td>
</tr>
</table>

## Why Typetify?

| Feature | Lodash | Ramda | Typetify |
|---------|--------|-------|----------|
| TypeScript-first | ❌ | ❌ | ✅ |
| Runtime safety | ❌ | ❌ | ✅ |
| Type narrowing | ❌ | ❌ | ✅ |
| Zero dependencies | ❌ | ✅ | ✅ |
| Tree-shakable | ⚠️ | ✅ | ✅ |
| Modern syntax | ❌ | ⚠️ | ✅ |
| Frontend utilities | ❌ | ❌ | ✅ |
| Backend utilities | ❌ | ❌ | ✅ |

## Installation

```bash
# npm
npm install typetify

# pnpm (faster)
pnpm add typetify

# yarn
yarn add typetify

# bun (fastest)
bun add typetify
```

**Requirements:**
- Node.js >= 18
- TypeScript >= 5.0 (recommended)

## Quick Start

```typescript
import { isDefined, pick, awaitTo, safeJsonParse } from 'typetify'

// Filter null/undefined with proper types
const items = [1, null, 2, undefined, 3]
const defined = items.filter(isDefined) // number[]

// Pick object keys (type-safe)
const user = { id: 1, name: 'John', password: 'secret' }
const safe = pick(user, ['id', 'name']) // { id: number, name: string }

// Handle async errors without try/catch
const [error, data] = await awaitTo(fetchUser(id))
if (error) {
  console.error('Failed:', error)
  return
}
console.log(data.name)

// Parse JSON safely
const result = safeJsonParse<User>(jsonString)
if (result.ok) {
  console.log(result.data.name)
} else {
  console.error(result.error)
}
```

## Migrating from Lodash

Typetify is designed to be a drop-in replacement for common Lodash patterns:

| Lodash | Typetify | Benefit |
|--------|----------|--------|
| `_.isNil(x)` | `isNil(x)` | Same API, better types |
| `_.pick(obj, keys)` | `pick(obj, keys)` | Type-safe keys |
| `_.omit(obj, keys)` | `omit(obj, keys)` | Type-safe keys |
| `_.uniq(arr)` | `unique(arr)` | Same behavior |
| `_.groupBy(arr, fn)` | `groupBy(arr, fn)` | Better inference |
| `_.chunk(arr, n)` | `chunk(arr, n)` | Same API |
| `_.debounce(fn, ms)` | `debounce(fn, ms)` | Simpler API |

**Bonus:** Use the `_` namespace to avoid migration conflicts:

```typescript
import { _ } from 'typetify'

// Works exactly like Lodash
const result = _.pick(user, ['id', 'name'])
```

### Using Underscore `_` (Lodash-style)

If you have naming conflicts with existing functions, use the underscore `_` namespace:

```typescript
// Import with underscore _ (just like Lodash!)
import { _ } from 'typetify'

// Use _.methodName() to avoid conflicts
const defined = items.filter(_.isDefined)
const safe = _.pick(user, ['id', 'name'])
const [error, data] = await _.awaitTo(fetchUser(id))

// Also works with default import
import _ from 'typetify'

// Or import * as
import * as _ from 'typetify'
```

## Modules

### Core — Foundations

```typescript
import { isDefined, isNil, assert, assertDefined, fail, noop, identity, unreachable } from 'typetify/core'

// isDefined — Filter null/undefined
const items = [1, null, 2].filter(isDefined) // number[]

// assert — Fail fast with type narrowing
const user: User | null = getUser()
assert(user, 'User not found')
// user is now User

// unreachable — Exhaustive switch statements
switch (status) {
  case 'pending': return handlePending()
  case 'done': return handleDone()
  default: unreachable(status)
}
```

### Guards — Type Guards

```typescript
import { isObject, isString, isNumber, hasKey, hasKeys, isEmpty } from 'typetify/guards'

// isObject — Check for objects (not arrays, not null)
if (isObject(value)) {
  // value is Record<string, unknown>
}

// hasKey — Safe property access
if (hasKey(response, 'data')) {
  console.log(response.data)
}

// isEmpty — Check for empty values
isEmpty('') // true
isEmpty([]) // true
isEmpty({}) // true
isEmpty(null) // true
```

### Object — Object Manipulation

```typescript
import { pick, omit, keysTyped, mapObject, get, set } from 'typetify/object'

// pick/omit — Type-safe object manipulation
const user = { id: 1, name: 'John', password: 'secret' }
pick(user, ['id', 'name']) // { id: 1, name: 'John' }
omit(user, ['password']) // { id: 1, name: 'John' }

// keysTyped — Object.keys with proper types
const keys = keysTyped(user) // ('id' | 'name' | 'password')[]

// mapObject — Map over object values
const prices = { apple: 1, banana: 2 }
mapObject(prices, v => v * 2) // { apple: 2, banana: 4 }

// get/set — Safe nested access (immutable)
get(user, ['profile', 'name'])
set(user, ['profile', 'age'], 30)
```

### Async — Async Utilities

```typescript
import { awaitTo, retry, sleep, withTimeout, debounce, throttle, parallel } from 'typetify/async'

// awaitTo — No more try/catch
const [error, user] = await awaitTo(fetchUser(id))

// retry — Retry with backoff
const data = await retry(() => fetchData(), {
  attempts: 3,
  delay: 1000,
  backoff: 2,
})

// withTimeout — Add timeout to any promise
const result = await withTimeout(fetchData(), 5000)

// parallel — Concurrent execution with limit
const results = await parallel(
  urls.map(url => () => fetch(url)),
  { concurrency: 3 }
)

// debounce/throttle
const debouncedSearch = debounce(search, 300)
const throttledScroll = throttle(onScroll, 100)
```

### Collection — Array Utilities

```typescript
import { unique, groupBy, partition, chunk, compact, sortBy, range } from 'typetify/collection'

// unique — Remove duplicates
unique([1, 2, 2, 3]) // [1, 2, 3]
unique(users, u => u.id) // Unique by key

// groupBy — Group by key
groupBy(users, u => u.role)
// { admin: [...], user: [...] }

// partition — Split by predicate
const [evens, odds] = partition([1, 2, 3, 4], n => n % 2 === 0)

// chunk — Split into chunks
chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]

// compact — Remove null/undefined
compact([1, null, 2, undefined]) // [1, 2]

// sortBy — Sort by key
sortBy(users, u => u.name)

// range — Generate number ranges
range(0, 5) // [0, 1, 2, 3, 4]
```

### Input — Parse External Data

```typescript
import { safeJsonParse, parseNumber, parseBoolean, parseDate, coerceArray, defaults } from 'typetify/input'

// safeJsonParse — No more try/catch for JSON
const result = safeJsonParse<User>(json)
if (result.ok) {
  console.log(result.data)
}

// parseNumber/parseBoolean/parseDate — Safe parsing
parseNumber('42') // 42
parseNumber('abc') // undefined
parseBoolean('yes') // true
parseDate('2024-01-15') // Date

// coerceArray — Ensure array
coerceArray('hello') // ['hello']
coerceArray(['a', 'b']) // ['a', 'b']
coerceArray(null) // []

// defaults — With empty string handling
defaults(null, 'fallback') // 'fallback'
defaults('', 'fallback') // 'fallback'
```

### Flow — Functional Utilities

```typescript
import { pipe, tap, when, match, tryCatch, ifElse } from 'typetify/flow'

// pipe — Chain transformations
const result = pipe(
  5,
  n => n * 2,
  n => n + 1,
  n => `Result: ${n}`
) // 'Result: 11'

// tap — Side effects in a chain
pipe(
  data,
  tap(console.log),
  transform,
)

// match — Pattern matching
const getDiscount = match<number, string>()
  .with(n => n >= 100, () => '20% off')
  .with(n => n >= 50, () => '10% off')
  .otherwise(() => 'No discount')

// tryCatch — Safe function execution
const result = tryCatch(() => JSON.parse(input))
if (result.ok) {
  console.log(result.value)
}
```

### DX — Developer Experience

```typescript
import { debug, invariant, assertNever, todo, measure } from 'typetify/dx'

// debug — Log in a pipe chain
pipe(data, debug('step 1'), transform, debug('step 2'))

// invariant — Assert with descriptive errors
invariant(user.id > 0, 'User ID must be positive')
// Throws: Invariant violation: User ID must be positive

// assertNever — Exhaustive checks
function handle(action: Action) {
  switch (action.type) {
    case 'add': return handleAdd()
    case 'remove': return handleRemove()
    default: assertNever(action)
  }
}

// todo — Mark unimplemented code
function processPayment() {
  todo('Implement payment processing')
}

// measure — Performance measurement
const { result, duration } = measure(() => heavyComputation())
console.log(`Took ${duration}ms`)
```

### 🎨 Typed — Type Utilities

```typescript
import { defineConst, defineEnum, brand, type DeepPartial, type Merge } from 'typetify/typed'

// defineConst — Frozen constants with literal types
const STATUS = defineConst({
  PENDING: 'pending',
  ACTIVE: 'active',
})
// typeof STATUS.PENDING = 'pending' (not string)

// defineEnum — Enum-like objects
const Role = defineEnum(['admin', 'user', 'guest'] as const)
// Role.admin = 'admin'

// brand — Branded types for type safety
type UserId = Brand<number, 'UserId'>
type PostId = Brand<number, 'PostId'>

function getUser(id: UserId) { ... }
getUser(1 as UserId) // OK
getUser(1 as PostId) // Error!

// Type utilities
type PartialUser = DeepPartial<User>
type MergedConfig = Merge<DefaultConfig, UserConfig>
```

## Real-World Examples

### 🎨 Frontend Focus

```typescript
import { 
  // DOM
  querySelector, classNames, addEventListener, isInViewport,
  // Storage
  localStorageTyped, withExpiry, getCookie,
  // Color
  lighten, darken, getContrastColor, opacity
} from 'typetify'

// Type-safe DOM manipulation
const button = querySelector<HTMLButtonElement>('#submit')
if (button) {
  button.className = classNames('btn', { 'btn-primary': isPrimary, 'btn-disabled': disabled })
}

// Event handling with automatic cleanup
const cleanup = addEventListener(button, 'click', () => {
  console.log('Clicked!')
})
// Later: cleanup()

// Lazy loading with viewport detection
const images = querySelectorAll<HTMLImageElement>('img[data-src]')
images.forEach(img => {
  if (isInViewport(img)) {
    img.src = img.dataset.src!
  }
})

// Type-safe localStorage
interface UserPrefs {
  theme: 'light' | 'dark'
  language: string
}
const prefs = localStorageTyped<UserPrefs>('user-prefs')
prefs.set({ theme: 'dark', language: 'en' })
const theme = prefs.get()?.theme // 'dark' | 'light' | undefined

// Storage with expiration
const cache = withExpiry<ApiResponse>('api-cache', {
  storage: sessionStorage,
  ttl: 5 * 60 * 1000 // 5 minutes
})

// Dynamic theming with color utilities
const primaryColor = '#3b82f6'
const hoverColor = lighten(primaryColor, 10)
const activeColor = darken(primaryColor, 10)
const textColor = getContrastColor(primaryColor) // '#ffffff' or '#000000'
const overlay = opacity('#000000', 0.5) // 'rgba(0, 0, 0, 0.5)'
```

### 🔧 Backend Focus

```typescript
import {
  // HTTP
  createHttpClient, requestWithRetry, bearerAuth, buildUrl,
  // DateTime
  formatDate, addTime, timeAgo, isBetween, parseDuration,
  // Path
  joinPath, parsePath, normalizePath, relativePath,
  // Crypto
  sha256, hmac, uuid, generateToken, base64Encode
} from 'typetify'

// Type-safe HTTP client with interceptors
const api = createHttpClient({
  baseUrl: 'https://api.example.com',
  timeout: 5000,
  headers: { Authorization: bearerAuth(token) },
  interceptors: {
    request: (opts) => {
      opts.headers = { ...opts.headers, 'X-Request-Id': uuid() }
      return opts
    }
  }
})

const users = await api.get<User[]>('/users')
const user = await api.post<User>('/users', { body: { name: 'John' } })

// Retry with exponential backoff
const data = await requestWithRetry<Data>('/api/data', {
  maxRetries: 3,
  delay: 1000,
  backoff: 'exponential'
})

// Date manipulation
const now = new Date()
const nextWeek = addTime(now, 7, 'days')
const formatted = formatDate(now, 'YYYY-MM-DD HH:mm')
console.log(timeAgo(lastLogin)) // '2 hours ago'

// Check booking availability
if (isBetween(requestedDate, bookingStart, bookingEnd)) {
  allowBooking()
}

// Parse duration strings
const ttl = parseDuration('2h 30m') // 9000000 (ms)

// Cross-platform path handling
const configPath = joinPath('/etc', 'app', 'config.json')
const { name, ext } = parsePath('/var/log/app.log') // { name: 'app', ext: '.log' }
const normalized = normalizePath('/home/user/../admin/./file.txt') // '/home/admin/file.txt'

// Cryptographic utilities
const hashedPassword = await sha256(password + salt)
const signature = await hmac(payload, webhookSecret)
const sessionId = uuid()
const apiKey = generateToken(32)
const encoded = base64Encode(JSON.stringify(data))
```

### API Response Validation

```typescript
import { hasKeys, isDefined, awaitTo } from 'typetify'

async function fetchUser(id: string) {
  const [error, response] = await awaitTo(fetch(`/api/users/${id}`))
  if (error) return { error: 'Network error' }

  const data = await response.json()
  
  // Runtime validation
  if (!hasKeys(data, ['id', 'name', 'email'])) {
    return { error: 'Invalid response format' }
  }

  return { data }
}
```

### Form Data Processing

```typescript
import { parseNumber, parseBoolean, compact, defaults } from 'typetify'

function processFormData(formData: FormData) {
  return {
    age: parseNumber(formData.get('age')),
    newsletter: parseBoolean(formData.get('newsletter')),
    tags: compact(formData.getAll('tags')),
    bio: defaults(formData.get('bio'), 'No bio provided'),
  }
}
```

### Safe Error Handling

```typescript
import { awaitTo, retry, withTimeout } from 'typetify'

async function fetchWithRetry(url: string) {
  const [error, data] = await awaitTo(
    retry(
      () => withTimeout(fetch(url), 5000),
      { attempts: 3, delay: 1000 }
    )
  )

  if (error) {
    console.error('Failed after retries:', error)
    return null
  }

  return data
}
```

## Tree Shaking

Import only what you need:

```typescript
// Import specific functions
import { isDefined } from 'typetify/core'
import { pick } from 'typetify/object'

// Or import everything
import { isDefined, pick, awaitTo } from 'typetify'
```

## Philosophy

1. **Runtime first** — Types are great, but runtime safety matters more
2. **No magic** — Every function does exactly what it says
3. **Composable** — Small functions that work together
4. **TypeScript-native** — Built for TS, not ported from JS

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## License

MIT © typetify
