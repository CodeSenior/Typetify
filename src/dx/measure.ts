export interface MeasureResult<T> {
  result: T
  duration: number
}

/**
 * Measures the execution time of a function.
 *
 * @example
 * const { result, duration } = measure(() => heavyComputation())
 * console.log(`Took ${duration}ms`)
 */
export function measure<T>(fn: () => T): MeasureResult<T> {
  const start = performance.now()
  const result = fn()
  const duration = performance.now() - start

  return { result, duration }
}

/**
 * Measures the execution time of an async function.
 *
 * @example
 * const { result, duration } = await measureAsync(() => fetchData())
 * console.log(`Took ${duration}ms`)
 */
export async function measureAsync<T>(
  fn: () => Promise<T>
): Promise<MeasureResult<T>> {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start

  return { result, duration }
}
