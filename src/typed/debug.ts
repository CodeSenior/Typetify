/**
 * Type Debugging Utilities
 * 
 * These utilities help developers understand and debug complex types.
 * They make type errors more readable and help catch type issues at compile time.
 */

// =============================================================================
// TYPE ASSERTIONS (Compile-time checks)
// =============================================================================

/**
 * Asserts that two types are exactly equal.
 * Causes a compile error if they're not.
 * 
 * @example
 * type Test = AssertEqual<{ a: 1 }, { a: 1 }> // OK
 * type Fail = AssertEqual<{ a: 1 }, { a: 2 }> // Error!
 */
export type AssertEqual<T, U> = (<G>() => G extends T ? 1 : 2) extends <G>() => G extends U ? 1 : 2
  ? T
  : { error: 'Types are not equal'; expected: U; actual: T }

/**
 * Asserts that T extends U.
 * 
 * @example
 * type Test = AssertExtends<'hello', string> // OK
 * type Fail = AssertExtends<string, 'hello'> // Error!
 */
export type AssertExtends<T, U> = T extends U
  ? T
  : { error: 'Type does not extend'; type: T; shouldExtend: U }

/**
 * Asserts that a type is not never.
 * Useful for catching accidental never types.
 * 
 * @example
 * type Test = AssertNotNever<string> // OK
 * type Fail = AssertNotNever<never> // Error!
 */
export type AssertNotNever<T> = [T] extends [never]
  ? { error: 'Type is never'; hint: 'Check for conflicting intersections or impossible conditions' }
  : T

/**
 * Asserts that a type is not any.
 * Helps prevent accidental any propagation.
 * 
 * @example
 * type Test = AssertNotAny<string> // OK
 * type Fail = AssertNotAny<any> // Error!
 */
export type AssertNotAny<T> = 0 extends 1 & T
  ? { error: 'Type is any'; hint: 'Add proper type annotations' }
  : T

/**
 * Asserts that a type is not unknown.
 * 
 * @example
 * type Test = AssertNotUnknown<string> // OK
 * type Fail = AssertNotUnknown<unknown> // Error!
 */
export type AssertNotUnknown<T> = unknown extends T
  ? 0 extends 1 & T
    ? T // It's any, not unknown
    : { error: 'Type is unknown'; hint: 'Add type narrowing or assertions' }
  : T

// =============================================================================
// TYPE INSPECTION
// =============================================================================

/**
 * Forces TypeScript to expand a type for better IDE display.
 * This is the famous "Prettify" hack that makes complex types readable.
 * 
 * @example
 * type Complex = Pick<Omit<User, 'password'>, 'name' | 'email'> & { role: string }
 * type Readable = Expand<Complex>
 * // Hover shows: { name: string; email: string; role: string }
 */
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

/**
 * Recursively expands a type for deep inspection.
 * 
 * @example
 * type Nested = { user: Pick<User, 'name'> & { settings: Partial<Settings> } }
 * type Readable = ExpandDeep<Nested>
 * // Shows fully expanded nested structure
 */
export type ExpandDeep<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandDeep<O[K]> }
    : never
  : T

/**
 * Shows the "shape" of a type without the actual values.
 * Useful for understanding complex generic types.
 * 
 * @example
 * type Shape = TypeShape<{ name: string; age: number; active: boolean }>
 * // { name: 'string'; age: 'number'; active: 'boolean' }
 */
export type TypeShape<T> = T extends string
  ? 'string'
  : T extends number
    ? 'number'
    : T extends boolean
      ? 'boolean'
      : T extends null
        ? 'null'
        : T extends undefined
          ? 'undefined'
          : T extends readonly unknown[]
            ? 'array'
            : T extends (...args: unknown[]) => unknown
              ? 'function'
              : T extends object
                ? { [K in keyof T]: TypeShape<T[K]> }
                : 'unknown'

/**
 * Gets the "kind" of a type as a string literal.
 * 
 * @example
 * type K1 = TypeKind<string> // 'string'
 * type K2 = TypeKind<{ a: 1 }> // 'object'
 * type K3 = TypeKind<string[]> // 'array'
 */
export type TypeKind<T> = [T] extends [never]
  ? 'never'
  : T extends string
    ? 'string'
    : T extends number
      ? 'number'
      : T extends boolean
        ? 'boolean'
        : T extends bigint
          ? 'bigint'
          : T extends symbol
            ? 'symbol'
            : T extends null
              ? 'null'
              : T extends undefined
                ? 'undefined'
                : T extends readonly unknown[]
                  ? 'array'
                  : T extends (...args: unknown[]) => unknown
                    ? 'function'
                    : T extends object
                      ? 'object'
                      : 'unknown'

// =============================================================================
// TYPE TESTING UTILITIES
// =============================================================================

/**
 * Test helper that expects a type to be true.
 * Use with conditional types to create type tests.
 * 
 * @example
 * type Test1 = Expect<true> // OK
 * type Test2 = Expect<false> // Error!
 */
export type Expect<T extends true> = T

/**
 * Test helper that expects a type to be false.
 * 
 * @example
 * type Test1 = ExpectFalse<false> // OK
 * type Test2 = ExpectFalse<true> // Error!
 */
export type ExpectFalse<T extends false> = T

/**
 * Checks if two types are exactly equal.
 * Returns true or false.
 * 
 * @example
 * type Test = Equal<{ a: 1 }, { a: 1 }> // true
 * type Test2 = Equal<{ a: 1 }, { a: 2 }> // false
 */
export type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2
  ? true
  : false

/**
 * Checks if two types are not equal.
 * 
 * @example
 * type Test = NotEqual<string, number> // true
 * type Test2 = NotEqual<string, string> // false
 */
export type NotEqual<A, B> = Equal<A, B> extends true ? false : true

/**
 * Checks if a type is exactly `any`.
 * 
 * @example
 * type Test = IsAny<any> // true
 * type Test2 = IsAny<unknown> // false
 */
export type IsAny<T> = 0 extends 1 & T ? true : false

/**
 * Checks if a type is exactly `never`.
 * 
 * @example
 * type Test = IsNever<never> // true
 * type Test2 = IsNever<void> // false
 */
export type IsNever<T> = [T] extends [never] ? true : false

/**
 * Checks if a type is exactly `unknown`.
 * 
 * @example
 * type Test = IsUnknown<unknown> // true
 * type Test2 = IsUnknown<any> // false
 */
export type IsUnknown<T> = IsAny<T> extends true
  ? false
  : unknown extends T
    ? true
    : false

/**
 * Checks if a type is a union (has multiple members).
 * 
 * @example
 * type Test = IsUnion<'a' | 'b'> // true
 * type Test2 = IsUnion<'a'> // false
 */
export type IsUnion<T, U = T> = T extends U
  ? [U] extends [T]
    ? false
    : true
  : never

/**
 * Checks if a type is a literal (not widened).
 * 
 * @example
 * type Test = IsLiteral<'hello'> // true
 * type Test2 = IsLiteral<string> // false
 */
export type IsLiteral<T> = T extends string
  ? string extends T
    ? false
    : true
  : T extends number
    ? number extends T
      ? false
      : true
    : T extends boolean
      ? boolean extends T
        ? false
        : true
      : false

// =============================================================================
// ERROR MESSAGE HELPERS
// =============================================================================

/**
 * Creates a custom compile-time error message.
 * 
 * @example
 * type ValidateAge<T extends number> = T extends number
 *   ? T
 *   : TypeError<'Age must be a number'>
 */
export type TypeError<Message extends string> = { __error: Message }

/**
 * Creates a branded error type with context.
 * 
 * @example
 * type Result = TypeErrorWithContext<'Invalid type', { expected: string; got: number }>
 */
export type TypeErrorWithContext<
  Message extends string,
  Context extends Record<string, unknown>
> = { __error: Message; __context: Context }

/**
 * Validates a type and returns an error if invalid.
 * 
 * @example
 * type ValidString<T> = Validate<T, string, 'Expected a string type'>
 */
export type Validate<T, Expected, ErrorMessage extends string> = T extends Expected
  ? T
  : TypeError<ErrorMessage>

// =============================================================================
// DEBUGGING FUNCTIONS (Runtime)
// =============================================================================

/**
 * A no-op function that helps debug types at compile time.
 * Hover over the parameter to see the inferred type.
 * 
 * @example
 * const user = { name: 'John', age: 30 }
 * showType(user) // Hover to see type
 */
export function showType<T>(_value: T): T {
  return _value
}

/**
 * Asserts a type at compile time without runtime overhead.
 * 
 * @example
 * const value = getValue()
 * assertType<string>(value) // Compile error if value is not string
 */
export function assertType<T>(_value: T): void {
  // No-op at runtime, type checking at compile time
}

/**
 * Creates a type-safe "impossible" marker.
 * Useful for exhaustiveness checking.
 * 
 * @example
 * function handleStatus(status: Status) {
 *   switch (status) {
 *     case 'pending': return 'Loading'
 *     case 'success': return 'Done'
 *     case 'error': return 'Failed'
 *     default: return impossible(status) // Error if cases are missing
 *   }
 * }
 */
export function impossible(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`)
}

/**
 * Type-safe identity function that preserves literal types.
 * Useful for type inference in complex scenarios.
 * 
 * @example
 * const config = identity({
 *   host: 'localhost',
 *   port: 3000,
 * } as const)
 * // Type is preserved as { readonly host: 'localhost'; readonly port: 3000 }
 */
export function identity<T>(value: T): T {
  return value
}

/**
 * Narrows a type using a type guard with better inference.
 * 
 * @example
 * const items: (string | number)[] = [1, 'a', 2, 'b']
 * const strings = items.filter(narrow((x): x is string => typeof x === 'string'))
 */
export function narrow<T, S extends T>(
  guard: (value: T) => value is S
): (value: T) => value is S {
  return guard
}
