import type { Result } from '../result/types'
import { ok } from '../result/ok'
import { err } from '../result/err'

/**
 * Collects all Promise<Result> outcomes into a single Result.
 * Returns Ok with all values if all succeed, or Err with first error.
 * 
 * @example
 * const results = await allResults([
 *   fetchUser(1),
 *   fetchUser(2),
 *   fetchUser(3)
 * ])
 * 
 * if (results.ok) {
 *   const [user1, user2, user3] = results.value
 * } else {
 *   console.error('One failed:', results.error)
 * }
 * 
 * @example
 * // With different types
 * const [userResult, profileResult] = await Promise.all([
 *   fetchUser(id),
 *   fetchProfile(id)
 * ])
 * const combined = allResultsSync([userResult, profileResult])
 */
export async function allResults<T, E = Error>(
  promises: readonly Promise<Result<T, E>>[]
): Promise<Result<T[], E>> {
  const results = await Promise.all(promises)
  
  const values: T[] = []
  for (const result of results) {
    if (!result.ok) {
      return err(result.error)
    }
    values.push(result.value)
  }
  
  return ok(values)
}

/**
 * Synchronous version of allResults for already resolved Results.
 * 
 * @example
 * const results = allResultsSync([ok(1), ok(2), ok(3)])
 * // => { ok: true, value: [1, 2, 3] }
 * 
 * const failed = allResultsSync([ok(1), err('failed'), ok(3)])
 * // => { ok: false, error: 'failed' }
 */
export function allResultsSync<T, E = Error>(
  results: readonly Result<T, E>[]
): Result<T[], E> {
  const values: T[] = []
  for (const result of results) {
    if (!result.ok) {
      return err(result.error)
    }
    values.push(result.value)
  }
  return ok(values)
}

/**
 * Returns the first successful Result from an array of Promise<Result>.
 * If all fail, returns the last error.
 * 
 * @example
 * const result = await anyResult([
 *   fetchFromPrimary(),
 *   fetchFromBackup(),
 *   fetchFromCache()
 * ])
 * 
 * if (result.ok) {
 *   console.log('Got data from one source:', result.value)
 * }
 * 
 * @example
 * // Fallback pattern
 * const config = await anyResult([
 *   loadFromEnv(),
 *   loadFromFile(),
 *   loadDefaults()
 * ])
 */
export async function anyResult<T, E = Error>(
  promises: readonly Promise<Result<T, E>>[]
): Promise<Result<T, E>> {
  if (promises.length === 0) {
    return err(new Error('No promises provided') as E)
  }
  
  let lastError: E | undefined
  
  for (const promise of promises) {
    const result = await promise
    if (result.ok) {
      return result
    }
    lastError = result.error
  }
  
  return err(lastError!)
}

/**
 * Synchronous version of anyResult for already resolved Results.
 * 
 * @example
 * const result = anyResultSync([err('a'), ok(2), err('c')])
 * // => { ok: true, value: 2 }
 * 
 * const failed = anyResultSync([err('a'), err('b')])
 * // => { ok: false, error: 'b' }
 */
export function anyResultSync<T, E = Error>(
  results: readonly Result<T, E>[]
): Result<T, E> {
  if (results.length === 0) {
    return err(new Error('No results provided') as E)
  }
  
  let lastError: E | undefined
  
  for (const result of results) {
    if (result.ok) {
      return result
    }
    lastError = result.error
  }
  
  return err(lastError!)
}

/**
 * Partitions an array of Results into successes and failures.
 * 
 * @example
 * const results = [ok(1), err('a'), ok(2), err('b')]
 * const { successes, failures } = partitionResults(results)
 * // successes: [1, 2]
 * // failures: ['a', 'b']
 */
export function partitionResults<T, E = Error>(
  results: readonly Result<T, E>[]
): { successes: T[]; failures: E[] } {
  const successes: T[] = []
  const failures: E[] = []
  
  for (const result of results) {
    if (result.ok) {
      successes.push(result.value)
    } else {
      failures.push(result.error)
    }
  }
  
  return { successes, failures }
}

/**
 * Collects all Results, returning both successes and failures.
 * Unlike allResults, this doesn't short-circuit on first error.
 * 
 * @example
 * const results = await collectResults([
 *   fetchUser(1),
 *   fetchUser(2), // might fail
 *   fetchUser(3)
 * ])
 * 
 * console.log('Succeeded:', results.successes.length)
 * console.log('Failed:', results.failures.length)
 */
export async function collectResults<T, E = Error>(
  promises: readonly Promise<Result<T, E>>[]
): Promise<{ successes: T[]; failures: E[] }> {
  const results = await Promise.all(promises)
  return partitionResults(results)
}
