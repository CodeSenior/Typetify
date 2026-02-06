/**
 * Pipeline - Functional composition with full type inference
 */

/**
 * Pipes a value through a series of functions.
 * Each function receives the result of the previous one.
 * 
 * @example
 * const result = pipe(
 *   [1, 2, 3, 4, 5],
 *   arr => arr.filter(x => x % 2 === 0),
 *   arr => arr.map(x => x * 2),
 *   arr => arr.reduce((a, b) => a + b, 0)
 * )
 * // result: 12
 * 
 * @example
 * // With async functions
 * const user = await pipeAsync(
 *   userId,
 *   id => fetchUser(id),
 *   user => enrichUserData(user),
 *   user => validateUser(user)
 * )
 */
export function pipe<A>(value: A): A
export function pipe<A, B>(value: A, fn1: (a: A) => B): B
export function pipe<A, B, C>(value: A, fn1: (a: A) => B, fn2: (b: B) => C): C
export function pipe<A, B, C, D>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D
): D
export function pipe<A, B, C, D, E>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E
): E
export function pipe<A, B, C, D, E, F>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
  fn5: (e: E) => F
): F
export function pipe<A, B, C, D, E, F, G>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
  fn5: (e: E) => F,
  fn6: (f: F) => G
): G
export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
  fn5: (e: E) => F,
  fn6: (f: F) => G,
  fn7: (g: G) => H
): H
export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
  fn5: (e: E) => F,
  fn6: (f: F) => G,
  fn7: (g: G) => H,
  fn8: (h: H) => I
): I
export function pipe(value: unknown, ...fns: ((arg: unknown) => unknown)[]): unknown {
  return fns.reduce((acc, fn) => fn(acc), value)
}

/**
 * Async version of pipe that handles promises.
 */
export async function pipeAsync<A>(value: A): Promise<A>
export async function pipeAsync<A, B>(value: A, fn1: (a: A) => B | Promise<B>): Promise<B>
export async function pipeAsync<A, B, C>(
  value: A,
  fn1: (a: A) => B | Promise<B>,
  fn2: (b: B) => C | Promise<C>
): Promise<C>
export async function pipeAsync<A, B, C, D>(
  value: A,
  fn1: (a: A) => B | Promise<B>,
  fn2: (b: B) => C | Promise<C>,
  fn3: (c: C) => D | Promise<D>
): Promise<D>
export async function pipeAsync<A, B, C, D, E>(
  value: A,
  fn1: (a: A) => B | Promise<B>,
  fn2: (b: B) => C | Promise<C>,
  fn3: (c: C) => D | Promise<D>,
  fn4: (d: D) => E | Promise<E>
): Promise<E>
export async function pipeAsync<A, B, C, D, E, F>(
  value: A,
  fn1: (a: A) => B | Promise<B>,
  fn2: (b: B) => C | Promise<C>,
  fn3: (c: C) => D | Promise<D>,
  fn4: (d: D) => E | Promise<E>,
  fn5: (e: E) => F | Promise<F>
): Promise<F>
export async function pipeAsync(
  value: unknown,
  ...fns: ((arg: unknown) => unknown | Promise<unknown>)[]
): Promise<unknown> {
  let result = value
  for (const fn of fns) {
    result = await fn(result)
  }
  return result
}

/**
 * Creates a pipeline function that can be reused.
 * 
 * @example
 * const processUser = flow(
 *   (user: User) => validateUser(user),
 *   user => enrichUser(user),
 *   user => formatUser(user)
 * )
 * 
 * const result = processUser(rawUser)
 */
export function flow<A, B>(fn1: (a: A) => B): (a: A) => B
export function flow<A, B, C>(fn1: (a: A) => B, fn2: (b: B) => C): (a: A) => C
export function flow<A, B, C, D>(
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D
): (a: A) => D
export function flow<A, B, C, D, E>(
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E
): (a: A) => E
export function flow<A, B, C, D, E, F>(
  fn1: (a: A) => B,
  fn2: (b: B) => C,
  fn3: (c: C) => D,
  fn4: (d: D) => E,
  fn5: (e: E) => F
): (a: A) => F
export function flow(...fns: ((arg: unknown) => unknown)[]): (a: unknown) => unknown {
  return (value: unknown) => fns.reduce((acc, fn) => fn(acc), value)
}
