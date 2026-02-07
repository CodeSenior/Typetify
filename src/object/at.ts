/**
 * Gets values at multiple paths from an object.
 * Returns an array of values in the same order as the paths.
 *
 * @example
 * // Get multiple properties
 * const user = { name: 'John', age: 30, email: 'john@example.com' }
 * at(user, ['name', 'email'])
 * // => ['John', 'john@example.com']
 *
 * @example
 * // Get nested properties
 * const data = {
 *   user: { name: 'Alice', profile: { avatar: 'alice.png' } },
 *   settings: { theme: 'dark' }
 * }
 * at(data, ['user.name', 'user.profile.avatar', 'settings.theme'])
 * // => ['Alice', 'alice.png', 'dark']
 *
 * @example
 * // Missing paths return undefined
 * const obj = { a: 1, b: 2 }
 * at(obj, ['a', 'c', 'b'])
 * // => [1, undefined, 2]
 *
 * @example
 * // Extract specific fields for display
 * const product = {
 *   id: 'p123',
 *   name: 'Widget',
 *   price: 29.99,
 *   stock: 150,
 *   category: { name: 'Electronics' }
 * }
 * at(product, ['name', 'price', 'category.name'])
 * // => ['Widget', 29.99, 'Electronics']
 *
 * @example
 * // Use with array destructuring
 * const config = { host: 'localhost', port: 3000, ssl: true }
 * const [host, port] = at(config, ['host', 'port'])
 * // host = 'localhost', port = 3000
 */
export function at<T extends Record<string, unknown>>(
  obj: T,
  paths: readonly string[]
): unknown[] {
  return paths.map((path) => getByPath(obj, path))
}

function getByPath(obj: unknown, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current == null || typeof current !== 'object') {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }

  return current
}
