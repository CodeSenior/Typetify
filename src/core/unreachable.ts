/**
 * Marks a code path as unreachable.
 * TypeScript will error if this function can be reached.
 * Useful for exhaustive switch statements.
 *
 * @example
 * switch (status) {
 *   case 'pending': return handlePending()
 *   case 'done': return handleDone()
 *   default: unreachable(status)
 * }
 */
export function unreachable(value: never, message?: string): never {
  throw new Error(
    message ?? `Unreachable code reached with value: ${JSON.stringify(value)}`
  )
}
