/**
 * Finds the first key in an object where the predicate returns true.
 *
 * @example
 * // Find key by value
 * const users = { john: 32, jane: 28, bob: 45 }
 * findKey(users, age => age > 30)
 * // => 'john'
 *
 * @example
 * // Find user ID by property
 * const usersById = {
 *   u1: { name: 'Alice', role: 'admin' },
 *   u2: { name: 'Bob', role: 'user' },
 *   u3: { name: 'Charlie', role: 'admin' }
 * }
 * findKey(usersById, user => user.role === 'admin')
 * // => 'u1'
 *
 * @example
 * // Find first matching config key
 * const config = {
 *   dev: { port: 3000, debug: true },
 *   staging: { port: 8080, debug: true },
 *   prod: { port: 80, debug: false }
 * }
 * findKey(config, env => env.debug === false)
 * // => 'prod'
 *
 * @example
 * // Returns undefined if not found
 * findKey({ a: 1, b: 2 }, v => v > 10)
 * // => undefined
 */
export function findKey<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T, obj: T) => boolean
): keyof T | undefined {
  for (const key of Object.keys(obj) as Array<keyof T>) {
    if (predicate(obj[key], key, obj)) {
      return key
    }
  }
  return undefined
}

/**
 * Finds the last key in an object where the predicate returns true.
 *
 * @example
 * // Find last matching key
 * const scores = { alice: 85, bob: 92, charlie: 88, diana: 95 }
 * findLastKey(scores, score => score > 90)
 * // => 'diana'
 *
 * @example
 * // Find last admin user
 * const usersById = {
 *   u1: { name: 'Alice', role: 'admin' },
 *   u2: { name: 'Bob', role: 'user' },
 *   u3: { name: 'Charlie', role: 'admin' }
 * }
 * findLastKey(usersById, user => user.role === 'admin')
 * // => 'u3'
 */
export function findLastKey<T extends Record<string, unknown>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T, obj: T) => boolean
): keyof T | undefined {
  const keys = Object.keys(obj) as Array<keyof T>
  for (let i = keys.length - 1; i >= 0; i--) {
    const key = keys[i]!
    if (predicate(obj[key], key, obj)) {
      return key
    }
  }
  return undefined
}
