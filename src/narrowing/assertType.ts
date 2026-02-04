import type { TypeGuard } from './types'

/**
 * Asserts that a value matches a type guard, throwing if it doesn't.
 * This is an assertion function that narrows the type in the current scope.
 * 
 * @example
 * function processUser(data: unknown) {
 *   assertType(data, isUser, 'Expected user data')
 *   // After this line, data is typed as User
 *   console.log(data.name)
 * }
 * 
 * @example
 * // With custom error
 * assertType(response, isApiResponse, () => 
 *   new ValidationError('Invalid API response', response)
 * )
 */
export function assertType<T, S extends T>(
  value: T,
  guard: TypeGuard<T, S>,
  message?: string | (() => Error)
): asserts value is S {
  if (!guard(value)) {
    if (typeof message === 'function') {
      throw message()
    }
    throw new TypeError(message ?? `Type assertion failed`)
  }
}

/**
 * Asserts that a value is defined (not null or undefined)
 * 
 * @example
 * const user: User | null = findUser(id)
 * assertDefined(user, `User ${id} not found`)
 * // After this line, user is typed as User
 * console.log(user.name)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message?: string
): asserts value is T {
  if (value === null || value === undefined) {
    throw new TypeError(message ?? 'Expected value to be defined')
  }
}

/**
 * Asserts that a value is not null
 */
export function assertNotNull<T>(
  value: T | null,
  message?: string
): asserts value is T {
  if (value === null) {
    throw new TypeError(message ?? 'Expected value to not be null')
  }
}

/**
 * Asserts a condition and narrows the type
 * 
 * @example
 * function process(value: string | number) {
 *   assertCondition(typeof value === 'string', 'Expected string')
 *   // value is now string
 *   return value.toUpperCase()
 * }
 */
export function assertCondition(
  condition: boolean,
  message?: string
): asserts condition {
  if (!condition) {
    throw new TypeError(message ?? 'Assertion failed')
  }
}

/**
 * Creates a type assertion function from a type guard
 * 
 * @example
 * const assertUser = createAssertion(isUser, 'Expected User')
 * 
 * function process(data: unknown) {
 *   assertUser(data)
 *   // data is now User
 * }
 */
export function createAssertion<T, S extends T>(
  guard: TypeGuard<T, S>,
  defaultMessage?: string
): (value: T, message?: string) => asserts value is S {
  return (value: T, message?: string): asserts value is S => {
    assertType(value, guard, message ?? defaultMessage)
  }
}
