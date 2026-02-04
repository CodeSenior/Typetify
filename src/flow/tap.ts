/**
 * Executes a side effect and returns the original value.
 * Useful for debugging in a pipe chain.
 *
 * @example
 * pipe(
 *   data,
 *   tap(console.log), // logs data
 *   transform,
 *   tap(console.log), // logs transformed data
 * )
 */
export function tap<T>(fn: (value: T) => void): (value: T) => T {
  return (value: T): T => {
    fn(value)
    return value
  }
}
