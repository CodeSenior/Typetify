/**
 * Asserts that a value is never reached.
 * Useful for exhaustive switch statements.
 * TypeScript will error if this function can be called.
 *
 * @example
 * type Status = 'pending' | 'done'
 * function handleStatus(status: Status) {
 *   switch (status) {
 *     case 'pending': return 'Waiting...'
 *     case 'done': return 'Complete!'
 *     default: assertNever(status)
 *   }
 * }
 */
export function assertNever(value: never, message?: string): never {
  throw new Error(
    message ?? `Unexpected value: ${JSON.stringify(value)}`
  )
}
