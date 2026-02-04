/**
 * Wraps a promise to return a tuple of [error, result].
 * Eliminates the need for try/catch blocks.
 *
 * @example
 * const [error, user] = await awaitTo(fetchUser(id))
 * if (error) {
 *   console.error('Failed to fetch user:', error)
 *   return
 * }
 * console.log(user.name)
 */
export async function awaitTo<T, E = Error>(
  promise: Promise<T>
): Promise<[E, null] | [null, T]> {
  try {
    const result = await promise
    return [null, result]
  } catch (error) {
    return [error as E, null]
  }
}
