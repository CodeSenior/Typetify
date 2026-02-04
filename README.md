# typetify

> Runtime TypeScript helpers — like Lodash, but TS-first.

[![npm version](https://img.shields.io/npm/v/typetify.svg)](https://www.npmjs.com/package/typetify)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why typetify?

TypeScript is powerful, but it doesn't protect you at runtime. Data from APIs, forms, localStorage, or JSON can break your app even when TypeScript says everything is fine.

**typetify** fills this gap with:

- ✅ **Runtime safety** — Guards and assertions that work at runtime
- ✅ **Perfect types** — IntelliSense that actually helps
- ✅ **Zero dependencies** — Lightweight and tree-shakable
- ✅ **Boring API** — No magic, no config, just functions

## Installation

```bash
npm install typetify
```

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

### Typed — Type Utilities

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
