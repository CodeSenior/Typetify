# Typetify Architecture

## Design Principles

### 1. Tree-Shaking Optimization ✅

typetify is built with optimal tree-shaking support to ensure users only bundle what they use.

**Implementation:**

- **ESM-first**: Primary exports use ES Modules format
- **No side effects**: `"sideEffects": false` in package.json
- **Modular exports**: Each category has its own entry point
- **Named exports**: All functions use named exports (never default)

**Package.json Configuration:**

```json
{
  "sideEffects": false,
  "module": "./dist/index.mjs",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.mjs",
      "require": "./dist/index.js"
    },
    "./core": {
      "types": "./dist/core/index.d.ts",
      "import": "./dist/core/index.mjs",
      "require": "./dist/core/index.js"
    }
    // ... other submodules
  }
}
```

**Build Configuration (tsup):**

```typescript
{
  format: ['cjs', 'esm'],
  splitting: true,
  treeshake: true,
  dts: true
}
```

**Usage Examples:**

```typescript
// ✅ Import only what you need - optimal tree-shaking
import { isDefined, pick } from 'typetify'

// ✅ Import from submodule - even better tree-shaking
import { isDefined } from 'typetify/core'
import { pick } from 'typetify/object'

// ❌ Avoid (but still works)
import * as _ from 'typetify'
```

### 2. Type Inference Excellence ✅

All functions use advanced TypeScript generics for maximum type safety and inference.

**Examples:**

#### pick - Preserves exact keys
```typescript
function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[]
): Pick<T, K>

const user = { id: 1, name: 'John', email: 'john@example.com' }
const picked = pick(user, ['id', 'name'])
// Type: { id: number; name: string }
// TypeScript knows exactly which keys are present
```

#### groupBy - Infers return type
```typescript
function groupBy<T, K extends PropertyKey>(
  array: T[],
  fn: (item: T) => K
): Record<K, T[]>

const users = [
  { id: 1, role: 'admin' },
  { id: 2, role: 'user' }
]
const grouped = groupBy(users, u => u.role)
// Type: Record<string, typeof users[number][]>
```

#### Result<T, E> - Type-safe error handling
```typescript
function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return err('Division by zero')
  return ok(a / b)
}

const result = divide(10, 2)
if (result.ok) {
  result.value // TypeScript knows this is number
} else {
  result.error // TypeScript knows this is string
}
```

### 3. Unified Result/Option Pattern ✅

Inspired by Rust, provides type-safe error handling without exceptions.

**Core Types:**

```typescript
type Result<T, E = Error> = 
  | { ok: true; value: T; error?: never }
  | { ok: false; value?: never; error: E }

type Option<T> = 
  | { some: true; value: T }
  | { some: false; value?: never }
```

**Key Functions:**

- **Constructors**: `ok()`, `err()`, `some()`, `none()`
- **Transformers**: `mapResult()`, `mapErr()`, `mapOption()`
- **Combinators**: `andThen()`, `orElse()`
- **Pattern Matching**: `matchResult()`, `matchOption()`
- **Type Guards**: `isOk()`, `isErr()`
- **Unwrappers**: `unwrap()`, `unwrapOr()`
- **Converters**: `fromNullable()`, `toNullable()`

**Unified API:**

All error-prone operations now return `Result<T, E>`:
- `safeJsonParse()` → `Result<T, Error>`
- `safeJsonStringify()` → `Result<string, Error>`
- `tryCatch()` → `Result<T, Error>`
- `tryCatchAsync()` → `Promise<Result<T, Error>>`

**Migration:**

Old custom types are deprecated but still work:
```typescript
// Old (deprecated)
type JsonParseResult<T> = 
  | { ok: true; data: T }
  | { ok: false; error: Error }

// New (recommended)
type JsonParseResult<T> = Result<T, Error>
```

## Module Structure

```
src/
├── core/          # isDefined, isNil, assert, identity, noop
├── guards/        # Type guards (isString, isNumber, isObject, etc.)
├── object/        # Object utilities (pick, omit, mapObject, etc.)
├── collection/    # Array utilities (groupBy, partition, chunk, etc.)
├── async/         # Async utilities (retry, debounce, throttle, etc.)
├── input/         # Input parsing (safeJsonParse, parseNumber, etc.)
├── flow/          # Function composition (pipe, compose, tryCatch, etc.)
├── result/        # Result/Option pattern (ok, err, andThen, etc.)
├── typed/         # Type utilities (Brand, DeepPartial, etc.)
├── string/        # String utilities (camelCase, slugify, etc.)
├── fn/            # Function utilities (memoize, curry, etc.)
├── math/          # Math utilities (sum, average, clamp, etc.)
├── dx/            # Developer experience (debug, measure, log, etc.)
└── index.ts       # Main entry point
```

## Bundle Size Optimization

### Techniques Used:

1. **Function-per-file**: Each utility is in its own file
2. **No barrel exports with re-exports**: Direct exports only
3. **Minimal dependencies**: Zero runtime dependencies
4. **Code splitting**: tsup automatically splits chunks
5. **Type-only imports**: Uses `import type` where possible

### Expected Bundle Impact:

```typescript
// Importing just isDefined
import { isDefined } from 'typetify'
// Bundle size: ~100 bytes (minified + gzipped)

// Importing Result utilities
import { ok, err, andThen, matchResult } from 'typetify'
// Bundle size: ~500 bytes (minified + gzipped)

// Importing entire library
import * as _ from 'typetify'
// Bundle size: ~15-20KB (minified + gzipped)
```

## Type Safety Features

### 1. Branded Types
```typescript
type UserId = Brand<number, 'UserId'>
type Email = Brand<string, 'Email'>

const userId = brand<UserId>(123)
const email = brand<Email>('user@example.com')

// Type error: can't mix branded types
function getUser(id: UserId) { }
getUser(123) // ❌ Error
getUser(userId) // ✅ OK
```

### 2. Exhaustive Type Checking
```typescript
type Status = 'pending' | 'success' | 'error'

function handleStatus(status: Status) {
  match(status, {
    pending: () => console.log('Pending...'),
    success: () => console.log('Success!'),
    error: () => console.log('Error!')
    // TypeScript ensures all cases are handled
  })
}
```

### 3. Deep Type Utilities
```typescript
type DeepPartial<T> // Makes all properties optional recursively
type DeepReadonly<T> // Makes all properties readonly recursively
type DeepRequired<T> // Makes all properties required recursively
type NonNullableDeep<T> // Removes null/undefined recursively
```

## Performance Considerations

### 1. Lazy Evaluation
Functions like `pipe` and `compose` don't execute until called:
```typescript
const transform = pipe(
  (x: number) => x * 2,
  (x) => x + 1,
  (x) => x.toString()
)
// Nothing executed yet

const result = transform(5) // Now executes: "11"
```

### 2. Memoization
```typescript
const expensive = memoize((n: number) => {
  // Heavy computation
  return result
})

expensive(5) // Computed
expensive(5) // Cached
```

### 3. Debounce/Throttle
```typescript
const search = debounce((query: string) => {
  // API call
}, 300)

// Only calls once after 300ms of inactivity
search('a')
search('ab')
search('abc') // Only this triggers the call
```

## Comparison with Lodash

| Feature | Lodash | typetify |
|---------|--------|----------|
| TypeScript-first | ❌ | ✅ |
| Tree-shaking | ⚠️ Requires lodash-es | ✅ Built-in |
| Result/Option | ❌ | ✅ |
| Type inference | ⚠️ Limited | ✅ Excellent |
| Bundle size | ~24KB (full) | ~15KB (full) |
| Zero dependencies | ✅ | ✅ |
| Branded types | ❌ | ✅ |
| Modern ESM | ⚠️ lodash-es only | ✅ |

## Future Enhancements

### Potential Additions:

1. **Async Result**: `AsyncResult<T, E>` for promise-based operations
2. **Result Combinators**: `all()`, `any()`, `race()` for multiple Results
3. **Lens/Optics**: Functional getters/setters for nested data
4. **Validation Builder**: Chainable validation with Result
5. **Effect System**: Track side effects in types
6. **Railway-Oriented Programming**: More combinators for error handling

### Community Feedback Welcome:

- GitHub Issues for feature requests
- Discussions for API design
- PRs for new utilities

## Testing Strategy

All functions include:
- Unit tests with Vitest
- Type tests (compile-time checks)
- Edge case coverage
- Performance benchmarks (for critical paths)

## Documentation

- **API Reference**: JSDoc comments on all functions
- **Examples**: `examples/` directory with real-world use cases
- **Guides**: `docs/` directory with detailed explanations
- **Type Definitions**: Exported `.d.ts` files for IDE support

## Contributing Guidelines

1. **One function per file**: Maintains tree-shaking
2. **Type-first**: Always include proper generics
3. **JSDoc comments**: Document parameters and examples
4. **Tests required**: 100% coverage goal
5. **No dependencies**: Keep the library lean
6. **Performance matters**: Benchmark critical functions
