/**
 * Execute async operations in sequence, stopping at first error.
 * Returns all results or error with partial results for debugging.
 * 
 * @example
 * const result = await sequence([
 *   () => fetchUser(id),
 *   (user) => fetchProfile(user.id),
 *   (profile) => fetchOrders(profile.userId)
 * ])
 * 
 * if (!result.ok) {
 *   console.error('Failed at step:', result.step, result.error)
 *   console.log('Partial results:', result.partial)
 *   return
 * }
 * 
 * const [user, profile, orders] = result.data
 * 
 * @example
 * // With error handling
 * const result = await sequence([
 *   () => validateInput(data),
 *   (validated) => processData(validated),
 *   (processed) => saveToDatabase(processed)
 * ])
 * 
 * if (!result.ok) {
 *   console.error(`Failed at step ${result.step}:`, result.error.message)
 *   return
 * }
 */

type SequenceStep<T = any> = (() => Promise<T>) | ((prev: any) => Promise<T>)

export type SequenceSuccess<T extends any[]> = {
  ok: true
  data: T
}

export type SequenceError = {
  ok: false
  error: Error
  step: number
  partial: any[]
}

export type SequenceResult<T extends any[]> = SequenceSuccess<T> | SequenceError

export async function sequence<T extends any[]>(
  steps: SequenceStep[]
): Promise<SequenceResult<T>> {
  const results: any[] = []
  
  try {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      if (!step) continue
      
      const prevResult = results[results.length - 1]
      
      // If first step or step doesn't take args, call without args
      const result = await (results.length === 0 || step.length === 0
        ? (step as () => Promise<any>)()
        : (step as (prev: any) => Promise<any>)(prevResult))
      
      results.push(result)
    }
    
    return {
      ok: true,
      data: results as T
    }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error : new Error(String(error)),
      step: results.length,
      partial: results
    }
  }
}
