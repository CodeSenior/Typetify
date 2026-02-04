declare const __brand: unique symbol

/**
 * Creates a branded type. Branded types are structurally identical
 * but nominally different, preventing accidental mixing.
 *
 * @example
 * type UserId = Brand<number, 'UserId'>
 * type PostId = Brand<number, 'PostId'>
 *
 * const userId = 1 as UserId
 * const postId = 2 as PostId
 *
 * function getUser(id: UserId) { ... }
 * getUser(userId) // OK
 * getUser(postId) // Error!
 */
export type Brand<T, B extends string> = T & { readonly [__brand]: B }

/**
 * Creates a branded value.
 *
 * @example
 * type UserId = Brand<number, 'UserId'>
 * const userId = brand<UserId>(1)
 */
export function brand<T extends Brand<unknown, string>>(value: T extends Brand<infer U, string> ? U : never): T {
  return value as T
}
