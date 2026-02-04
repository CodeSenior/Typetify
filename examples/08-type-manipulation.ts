/**
 * Solutions to TypeScript type-manipulation problems
 * 
 * This file demonstrates how Typetify solves the difficulties
 * developers encounter with unions, intersections,
 * and type-level programming.
 */

// ============================================================================
// PROBLEM 1: Intersection (&) vs Union (|) hell
// ============================================================================

import type {
  // Union utilities
  Discriminate,
  ExcludeDiscriminant,
  UnionToTuple,
  SafeMerge,
  DeepMergeType,
  IntersectionIsNever,
  ConflictingKeys,
  VariantUnion,
  TaggedUnion,
  TypedUnion,
  // Type debugging
  Expand,
  ExpandDeep,
  Prettify,
  AssertEqual,
  AssertNotNever,
  Equal,
} from '../src/typed'

import {
  // Pattern matching
  match,
  matchUnion,
  matchValue,
  // Merge functions
  merge,
  deepMergeFn,
  mergeWith,
  // Debug functions
  showType,
  impossible,
} from '../src/typed'

// ❌ PROBLEM: Intersecting types with conflicting properties = never
type BadIntersection = { name: string } & { name: number }
// BadIntersection['name'] is 'never' because string & number = never

// ✅ SOLUTION: SafeMerge handles conflicts cleanly
type A = { name: string; age: number }
type B = { name: string; email: string }
type Merged = SafeMerge<A, B>
// { name: string; age: number; email: string }

// Verify the type is correct
type _TestMerge = AssertEqual<Merged, { age: number; name: string; email: string }>

// ✅ SOLUTION: Detect conflicts before they cause problems
type Conflicts = ConflictingKeys<{ a: string; b: number }, { a: number; b: number }>
// 'a' - because 'a' has different types

type WouldBeNever = IntersectionIsNever<{ a: string }, { a: number }>
// true - warning that the intersection would be never

// ============================================================================
// PROBLEM 2: Misunderstood discriminated unions
// ============================================================================

// ❌ PROBLEM: Impossible states with booleans
interface BadState {
  isLoading: boolean
  isError: boolean
  data?: User
  error?: Error
}
// Allows isLoading: true AND data: User (impossible state!)

interface User {
  id: number
  name: string
}

// ✅ SOLUTION: Discriminated union with VariantUnion
type ApiState = VariantUnion<'status', {
  loading: {}
  success: { data: User }
  error: { message: string }
}>
// Equivalent to:
// | { status: 'loading' }
// | { status: 'success'; data: User }
// | { status: 'error'; message: string }

// ✅ SOLUTION: TaggedUnion for the 'tag' pattern
type Result<T> = TaggedUnion<{
  ok: { value: T }
  err: { error: Error }
}>
// | { tag: 'ok'; value: T }
// | { tag: 'err'; error: Error }

// ✅ SOLUTION: TypedUnion for the 'type' pattern (Redux-style)
type Action = TypedUnion<{
  increment: { amount: number }
  decrement: { amount: number }
  reset: {}
}>
// | { type: 'increment'; amount: number }
// | { type: 'decrement'; amount: number }
// | { type: 'reset' }

// ============================================================================
// PROBLEM 3: Exhaustive pattern matching
// ============================================================================

// ❌ PROBLEM: Forgetting a case in a switch
function handleStateBad(state: ApiState): string {
  switch (state.status) {
    case 'loading': return 'Loading...'
    case 'success': return state.data.name
    case 'error': return state.message
    // Without Typetify, it's easy to forget a case
  }
}

// ✅ SOLUTION: matchUnion with guaranteed exhaustiveness
function handleStateGood(state: ApiState): string {
  return matchUnion(state, 'status', {
    loading: () => 'Loading...',
    success: (s) => `Hello ${s.data.name}`,
    error: (s) => `Error: ${s.message}`,
    // TypeScript errors if you forget a case!
  })
}

// ✅ SOLUTION: match() builder for more flexibility
function handleStateBuilder(state: ApiState): string {
  return match(state, 'status')
    .with('loading', () => 'Loading...')
    .with('success', (s) => `Hello ${s.data.name}`)
    .with('error', (s) => `Error: ${s.message}`)
    .exhaustive() as string
}

// ✅ SOLUTION: matchValue for simple unions
type Status = 'pending' | 'active' | 'completed'

function getStatusLabel(status: Status): string {
  return matchValue(status, {
    pending: () => '⏳ Pending',
    active: () => '🔄 In progress',
    completed: () => '✅ Completed',
  })
}

// ============================================================================
// PROBLEM 4: Types that "explode" (readability)
// ============================================================================

// ❌ PROBLEM: Unreadable types in the IDE
type ComplexType = Pick<Omit<User & { settings: { theme: string } }, 'id'>, 'name' | 'settings'>
// Tooltip shows: Pick<Omit<User & { settings: { theme: string } }, 'id'>, 'name' | 'settings'>

// ✅ SOLUTION: Expand to "flatten" the type
type ReadableType = Expand<ComplexType>
// Tooltip shows: { name: string; settings: { theme: string } }

// ✅ SOLUTION: ExpandDeep for nested types
type NestedComplex = {
  user: Pick<User, 'name'> & { profile: Partial<{ bio: string; avatar: string }> }
}
type ReadableNested = ExpandDeep<NestedComplex>
// Shows the fully flattened structure

// ✅ SOLUTION: Prettify (already in types.ts)
type PrettyType = Prettify<{ a: 1 } & { b: 2 } & { c: 3 }>
// { a: 1; b: 2; c: 3 }

// ============================================================================
// PROBLEM 5: Smart merge
// ============================================================================

const base = { name: 'John', age: 30, settings: { theme: 'light' } }
const override = { age: 31, settings: { notifications: true } }

// ❌ PROBLEM: Spread loses precision for nested types
const badMerge = { ...base, ...override }
// settings is fully replaced, not merged

// ✅ SOLUTION: merge() for a simple merge with precise types
const simpleMerge = merge(base, override)
// Type is preserved correctly

// ✅ SOLUTION: deepMergeFn() for a recursive merge
const deepMerged = deepMergeFn(base, override)
// settings contient { theme: 'light', notifications: true }

// ✅ SOLUTION: mergeWith() for conflict control
const customMerge = mergeWith(
  { count: 10, name: 'A' },
  { count: 5, name: 'B' },
  {
    count: (a, b) => a + b, // Add instead of replace
  }
)
// { count: 15, name: 'B' }

// ============================================================================
// PROBLEM 6: Extracting members from a union
// ============================================================================

type Event = 
  | { type: 'click'; x: number; y: number }
  | { type: 'keypress'; key: string }
  | { type: 'scroll'; delta: number }

// ✅ SOLUTION: Discriminate to extract a member
type ClickEvent = Discriminate<Event, 'type', 'click'>
// { type: 'click'; x: number; y: number }

// ✅ SOLUTION: ExcludeDiscriminant to exclude a member
type NonClickEvent = ExcludeDiscriminant<Event, 'type', 'click'>
// { type: 'keypress'; key: string } | { type: 'scroll'; delta: number }

// ============================================================================
// PROBLEM 7: Type debugging
// ============================================================================

// ✅ SOLUTION: showType to inspect a type at runtime
const config = { host: 'localhost', port: 3000 } as const
const inspected = showType(config)
// Hover 'inspected' to see the exact type

// ✅ SOLUTION: AssertEqual for type tests
type _Test1 = AssertEqual<string, string> // OK
// type _Test2 = AssertEqual<string, number> // Compile-time error!

// ✅ SOLUTION: AssertNotNever to detect accidental never types
type SafeType = AssertNotNever<string> // OK
// type UnsafeType = AssertNotNever<string & number> // Error! It's never

// ✅ SOLUTION: Equal for conditional checks
type AreEqual = Equal<{ a: 1 }, { a: 1 }> // true
type AreNotEqual = Equal<{ a: 1 }, { a: 2 }> // false

// ✅ SOLUTION: impossible() for exhaustiveness checking
function processEvent(event: Event): string {
  switch (event.type) {
    case 'click': return `Click at ${event.x}, ${event.y}`
    case 'keypress': return `Key: ${event.key}`
    case 'scroll': return `Scroll: ${event.delta}`
    default: return impossible(event) // Error if we forget a case
  }
}

// ============================================================================
// PROBLEM 8: Union <-> Tuple conversion
// ============================================================================

// ✅ SOLUTION: UnionToTuple to convert a union to a tuple
type Colors = 'red' | 'green' | 'blue'
type ColorTuple = UnionToTuple<Colors>
// ['red', 'green', 'blue'] (order may vary)

// ============================================================================
// SUMMARY: Typetify hides complexity behind simple functions
// ============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           TYPETIFY - SIMPLIFIED TYPE MANIPULATION                ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  UNIONS & INTERSECTIONS                                          ║
║  ├─ SafeMerge<A, B>      → Merge without conflicts               ║
║  ├─ IntersectionIsNever  → Detects never intersections           ║
║  ├─ ConflictingKeys      → Finds conflicting keys                ║
║  └─ Discriminate         → Extracts a union member               ║
║                                                                  ║
║  DISCRIMINATED UNIONS                                            ║
║  ├─ VariantUnion         → Creates a discriminated union         ║
║  ├─ TaggedUnion          → Pattern { tag: 'xxx' }                ║
║  ├─ TypedUnion           → Pattern { type: 'xxx' }               ║
║  └─ matchUnion()         → Exhaustive pattern matching           ║
║                                                                  ║
║  TYPE READABILITY                                                ║
║  ├─ Prettify<T>          → Flattens intersections                ║
║  ├─ Expand<T>            → Shows the final type                  ║
║  └─ ExpandDeep<T>        → Recursive expansion                   ║
║                                                                  ║
║  SMART MERGE                                                     ║
║  ├─ merge()              → Typed shallow merge                   ║
║  ├─ deepMergeFn()        → Recursive merge                       ║
║  └─ mergeWith()          → Merge with resolvers                  ║
║                                                                  ║
║  DEBUGGING                                                      ║
║  ├─ showType()           → Inspect a type                        ║
║  ├─ AssertEqual          → Check type equality                   ║
║  ├─ AssertNotNever       → Detect never types                    ║
║  └─ impossible()         → Exhaustiveness checking               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`)

// ============================================================================
// COMPLETE EXAMPLE: API with typed states
// ============================================================================

// Definition of the possible states
type RequestState<T> = VariantUnion<'status', {
  idle: {}
  loading: { startedAt: Date }
  success: { data: T; fetchedAt: Date }
  error: { error: Error; failedAt: Date }
}>

// Type-safe render function
function renderRequest<T>(
  state: RequestState<T>,
  render: { data: (data: T) => string }
): string {
  return matchUnion(state, 'status', {
    idle: () => 'Ready to load',
    loading: (s) => `Loading since ${s.startedAt.toISOString()}...`,
    success: (s) => render.data(s.data),
    error: (s) => `Error: ${s.error.message}`,
  })
}

// Usage
const userState: RequestState<User> = {
  status: 'success',
  data: { id: 1, name: 'Alice' },
  fetchedAt: new Date(),
}

const output = renderRequest(userState, {
  data: (user) => `User: ${user.name}`,
})

console.log(output) // "User: Alice"
