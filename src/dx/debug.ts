/**
 * Logs a value with a label and returns it.
 * Useful for debugging in a pipe chain without breaking the flow.
 *
 * @example
 * const result = pipe(
 *   data,
 *   debug('initial'),
 *   transform,
 *   debug('after transform'),
 * )
 */
export function debug<T>(label: string): (value: T) => T {
  return (value: T): T => {
    console.log(`[${label}]`, value)
    return value
  }
}
