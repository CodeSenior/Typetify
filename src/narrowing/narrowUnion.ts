/**
 * Narrows a discriminated union by its discriminant property.
 * 
 * @example
 * type Event = 
 *   | { type: 'click'; x: number; y: number }
 *   | { type: 'keypress'; key: string }
 *   | { type: 'scroll'; delta: number }
 * 
 * const event: Event = getEvent()
 * 
 * if (narrowUnion(event, 'type', 'click')) {
 *   // event is { type: 'click'; x: number; y: number }
 *   console.log(event.x, event.y)
 * }
 */
export function narrowUnion<
  T extends Record<K, PropertyKey>,
  K extends keyof T,
  V extends T[K]
>(
  value: T,
  key: K,
  expected: V
): value is Extract<T, Record<K, V>> {
  return value[key] === expected
}

/**
 * Creates a type guard for a specific discriminant value
 * 
 * @example
 * type Result = { status: 'ok'; data: string } | { status: 'error'; message: string }
 * 
 * const isOk = createDiscriminantGuard<Result>()('status', 'ok')
 * const isError = createDiscriminantGuard<Result>()('status', 'error')
 * 
 * if (isOk(result)) {
 *   console.log(result.data)
 * }
 */
export function createDiscriminantGuard<T extends Record<string, unknown>>() {
  return <K extends keyof T, V extends T[K]>(
    key: K,
    value: V
  ): ((obj: T) => obj is Extract<T, Record<K, V>>) => {
    return (obj: T): obj is Extract<T, Record<K, V>> => obj[key] === value
  }
}

/**
 * Exhaustive switch helper for discriminated unions
 * 
 * @example
 * type Shape = 
 *   | { kind: 'circle'; radius: number }
 *   | { kind: 'square'; side: number }
 *   | { kind: 'rectangle'; width: number; height: number }
 * 
 * function area(shape: Shape): number {
 *   return switchUnion(shape, 'kind', {
 *     circle: (s) => Math.PI * s.radius ** 2,
 *     square: (s) => s.side ** 2,
 *     rectangle: (s) => s.width * s.height,
 *   })
 * }
 */
export function switchUnion<
  T extends Record<K, string>,
  K extends keyof T,
  R
>(
  value: T,
  key: K,
  handlers: { [V in T[K]]: (value: Extract<T, Record<K, V>>) => R }
): R {
  const discriminant = value[key] as T[K]
  const handler = handlers[discriminant]
  return handler(value as Extract<T, Record<K, T[K]>>)
}

/**
 * Type-safe exhaustive check that ensures all union cases are handled
 * 
 * @example
 * type Status = 'pending' | 'success' | 'error'
 * 
 * function handleStatus(status: Status) {
 *   switch (status) {
 *     case 'pending': return 'Loading...'
 *     case 'success': return 'Done!'
 *     case 'error': return 'Failed'
 *     default: return exhaustiveCheck(status)
 *   }
 * }
 */
export function exhaustiveCheck(value: never, message?: string): never {
  throw new Error(
    message ?? `Exhaustive check failed: unexpected value ${JSON.stringify(value)}`
  )
}
