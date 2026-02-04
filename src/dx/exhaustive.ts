/**
 * Ensures exhaustive handling of a discriminated union.
 * Returns the value for use in expressions.
 *
 * @example
 * type Action = { type: 'add'; value: number } | { type: 'remove'; id: string }
 *
 * function reduce(action: Action) {
 *   switch (action.type) {
 *     case 'add': return handleAdd(action.value)
 *     case 'remove': return handleRemove(action.id)
 *     default: return exhaustive(action)
 *   }
 * }
 */
export function exhaustive(value: never): never {
  throw new Error(`Exhaustive check failed: ${JSON.stringify(value)}`)
}
