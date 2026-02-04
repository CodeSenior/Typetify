# Result/Option Pattern Guide

## Overview

Typetify provides a comprehensive `Result<T, E>` and `Option<T>` pattern inspired by Rust, enabling type-safe error handling without `try/catch` blocks. This approach makes error handling explicit, composable, and easier to reason about.

## Why Use Result/Option?

### Traditional Approach (Problematic)
```typescript
function getUser(id: number): User {
  if (id < 0) {
    throw new Error('Invalid ID')
  }
  // ... fetch user
  return user
}

// Caller must remember to wrap in try/catch
try {
  const user = getUser(id)
  console.log(user.name)
} catch (error) {
  console.error(error)
}
```

### Result Pattern (Better)
```typescript
function getUser(id: number): Result<User, string> {
  if (id < 0) {
    return err('Invalid ID')
  }
  // ... fetch user
  return ok(user)
}

// Error handling is explicit and type-safe
const result = getUser(id)
if (result.ok) {
  console.log(result.value.name) // TypeScript knows this is safe
} else {
  console.error(result.error)
}
```

## Core Types

### Result<T, E>

Represents an operation that can succeed with value `T` or fail with error `E`.

```typescript
type Result<T, E = Error> = 
  | { ok: true; value: T; error?: never }
  | { ok: false; value?: never; error: E }
```

### Option<T>

Represents a value that may or may not exist (similar to `T | null` but more explicit).

```typescript
type Option<T> = 
  | { some: true; value: T }
  | { some: false; value?: never }
```

## Creating Results and Options

```typescript
import { ok, err, some, none } from 'typetify'

// Success
const success = ok(42)
// Result<number, never>

// Failure
const failure = err('Something went wrong')
// Result<never, string>

// Value exists
const value = some('hello')
// Option<string>

// No value
const empty = none()
// Option<never>
```

## Pattern Matching

### matchResult

Execute different code paths based on success or failure:

```typescript
import { matchResult } from 'typetify'

const message = matchResult(result, {
  ok: (value) => `Success: ${value}`,
  err: (error) => `Failed: ${error}`
})
```

### matchOption

Handle optional values explicitly:

```typescript
import { matchOption } from 'typetify'

const text = matchOption(option, {
  some: (value) => `Found: ${value}`,
  none: () => 'Not found'
})
```

## Transforming Results

### mapResult - Transform Success Values

```typescript
import { mapResult } from 'typetify'

const result = ok(5)
const doubled = mapResult(result, n => n * 2)
// Result<number, never> with value 10
```

### mapErr - Transform Error Values

```typescript
import { mapErr } from 'typetify'

const result = err('failed')
const detailed = mapErr(result, msg => new Error(msg))
// Result<never, Error>
```

## Chaining Operations

### andThen - Chain Result-Returning Functions

Also known as `flatMap` or `bind` in other languages. Use this when your transformation function returns a `Result`.

```typescript
import { andThen } from 'typetify'

function parseUser(json: string): Result<User, Error> {
  return safeJsonParse<User>(json)
}

function validateUser(user: User): Result<User, Error> {
  if (!user.email) {
    return err(new Error('Email required'))
  }
  return ok(user)
}

function saveUser(user: User): Result<User, Error> {
  // ... save to database
  return ok(user)
}

// Chain operations that can each fail
const result = andThen(
  andThen(parseUser(jsonString), validateUser),
  saveUser
)
```

### orElse - Provide Fallback on Error

```typescript
import { orElse } from 'typetify'

const result = orElse(
  findUser(id),
  () => ok(getDefaultUser())
)
// Always succeeds with either found user or default
```

## Unwrapping Values

### unwrapOr - Provide Default Value

```typescript
import { unwrapOr } from 'typetify'

const value = unwrapOr(result, 'default')
// Returns result.value if ok, otherwise 'default'
```

### unwrap - Throw on Error (Use Sparingly)

```typescript
import { unwrap } from 'typetify'

const value = unwrap(result)
// Returns result.value if ok, throws if err
// Only use when you're certain the result is ok
```

## Type Guards

```typescript
import { isOk, isErr } from 'typetify'

if (isOk(result)) {
  console.log(result.value) // TypeScript knows this is safe
}

if (isErr(result)) {
  console.log(result.error) // TypeScript knows this exists
}
```

## Working with Nullable Values

### fromNullable - Convert null/undefined to Option

```typescript
import { fromNullable } from 'typetify'

const maybeUser: User | null = findUserOrNull(id)
const option = fromNullable(maybeUser)
// Option<User>
```

### toNullable - Convert Option to null/undefined

```typescript
import { toNullable } from 'typetify'

const option = some(42)
const value = toNullable(option)
// 42 | null
```

## Built-in Result Functions

### safeJsonParse

```typescript
import { safeJsonParse } from 'typetify'

const result = safeJsonParse<User>('{"name": "Alice"}')
// Result<User, Error>

if (result.ok) {
  console.log(result.value.name)
}
```

### tryCatch

```typescript
import { tryCatch } from 'typetify'

const result = tryCatch(() => {
  return riskyOperation()
})
// Result<ReturnType, Error>
```

### tryCatchAsync

```typescript
import { tryCatchAsync } from 'typetify'

const result = await tryCatchAsync(async () => {
  return await fetchData()
})
// Result<Data, Error>
```

## Real-World Example: API Request Pipeline

```typescript
import {
  andThen,
  mapResult,
  matchResult,
  type Result,
} from 'typetify'

interface ApiResponse {
  data: unknown
  status: number
}

function fetchData(url: string): Result<ApiResponse, Error> {
  // ... fetch implementation
}

function validateStatus(response: ApiResponse): Result<ApiResponse, Error> {
  if (response.status >= 200 && response.status < 300) {
    return ok(response)
  }
  return err(new Error(`HTTP ${response.status}`))
}

function parseUsers(response: ApiResponse): Result<User[], Error> {
  if (Array.isArray(response.data)) {
    return ok(response.data as User[])
  }
  return err(new Error('Invalid data format'))
}

// Complete pipeline without try/catch
function getUsersFromApi(url: string): Result<User[], Error> {
  return andThen(
    andThen(fetchData(url), validateStatus),
    parseUsers
  )
}

// Handle the result
const users = matchResult(getUsersFromApi('/api/users'), {
  ok: (users) => {
    console.log(`Loaded ${users.length} users`)
    return users
  },
  err: (error) => {
    console.error('Failed:', error.message)
    return []
  }
})
```

## Best Practices

### 1. Use Result for Operations That Can Fail

```typescript
// ✅ Good
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) {
    return err('Division by zero')
  }
  return ok(a / b)
}

// ❌ Avoid throwing
function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Division by zero')
  }
  return a / b
}
```

### 2. Chain Operations with andThen

```typescript
// ✅ Good - Composable
const result = andThen(
  andThen(step1(), step2),
  step3
)

// ❌ Avoid nested if statements
const result1 = step1()
if (result1.ok) {
  const result2 = step2(result1.value)
  if (result2.ok) {
    const result3 = step3(result2.value)
    // ...
  }
}
```

### 3. Use Pattern Matching for Clarity

```typescript
// ✅ Good - Clear intent
const message = matchResult(result, {
  ok: (value) => `Success: ${value}`,
  err: (error) => `Failed: ${error}`
})

// ❌ Less clear
const message = result.ok 
  ? `Success: ${result.value}` 
  : `Failed: ${result.error}`
```

### 4. Prefer Specific Error Types

```typescript
// ✅ Good - Type-safe errors
type ValidationError = { type: 'validation'; field: string }
type NetworkError = { type: 'network'; code: number }
type AppError = ValidationError | NetworkError

function validate(data: unknown): Result<Data, AppError> {
  // ...
}

// ❌ Generic errors lose information
function validate(data: unknown): Result<Data, Error> {
  // ...
}
```

## Migration Guide

If you're using the old custom result types, they're now deprecated but still work:

```typescript
// Old (still works, but deprecated)
const result: JsonParseResult<User> = safeJsonParse(json)
if (result.ok) {
  console.log(result.data) // ⚠️ Old API used 'data'
}

// New (recommended)
const result: Result<User, Error> = safeJsonParse(json)
if (result.ok) {
  console.log(result.value) // ✅ New API uses 'value'
}
```

## API Reference

| Function | Signature | Description |
|----------|-----------|-------------|
| `ok` | `<T>(value: T) => Result<T, never>` | Create a success result |
| `err` | `<E>(error: E) => Result<never, E>` | Create an error result |
| `some` | `<T>(value: T) => Option<T>` | Create a some option |
| `none` | `() => Option<never>` | Create a none option |
| `mapResult` | `<T, U, E>(result: Result<T, E>, fn: (T) => U) => Result<U, E>` | Transform success value |
| `mapErr` | `<T, E, F>(result: Result<T, E>, fn: (E) => F) => Result<T, F>` | Transform error value |
| `andThen` | `<T, U, E>(result: Result<T, E>, fn: (T) => Result<U, E>) => Result<U, E>` | Chain result-returning functions |
| `orElse` | `<T, E, F>(result: Result<T, E>, fn: (E) => Result<T, F>) => Result<T, F>` | Provide fallback on error |
| `matchResult` | `<T, E, U>(result: Result<T, E>, handlers: {...}) => U` | Pattern match on result |
| `matchOption` | `<T, U>(option: Option<T>, handlers: {...}) => U` | Pattern match on option |
| `isOk` | `<T, E>(result: Result<T, E>) => boolean` | Type guard for success |
| `isErr` | `<T, E>(result: Result<T, E>) => boolean` | Type guard for error |
| `unwrap` | `<T, E>(result: Result<T, E>) => T` | Unwrap or throw |
| `unwrapOr` | `<T, E>(result: Result<T, E>, defaultValue: T) => T` | Unwrap with default |
| `fromNullable` | `<T>(value: T \| null \| undefined) => Option<T>` | Convert nullable to option |
| `toNullable` | `<T>(option: Option<T>) => T \| null` | Convert option to nullable |

## See Also

- [Examples](../examples/06-result-pattern.ts) - Complete working examples
- [Rust Result Documentation](https://doc.rust-lang.org/std/result/) - Original inspiration
