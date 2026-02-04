/**
 * Returns a promise that resolves after the specified milliseconds.
 *
 * @example
 * await sleep(1000) // wait 1 second
 * console.log('Done waiting')
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
