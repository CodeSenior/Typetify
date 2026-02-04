/**
 * Returns true if all values are truthy.
 *
 * @example
 * if (allTruthy([user, user.isActive, user.hasPermission])) {
 *   // proceed
 * }
 */
export function allTruthy(values: readonly unknown[]): boolean {
  return values.every(Boolean)
}

/**
 * Returns true if all values pass the predicate.
 *
 * @example
 * const allValid = allWhere([email1, email2, email3], isValidEmail)
 */
export function allWhere<T>(
  values: readonly T[],
  predicate: (value: T) => boolean
): boolean {
  return values.every(predicate)
}

/**
 * Returns true if all values are defined (not null or undefined).
 *
 * @example
 * if (allDefined([user, user.profile, user.profile.settings])) {
 *   // safe to access user.profile.settings
 * }
 */
export function allDefined(
  values: readonly unknown[]
): boolean {
  return values.every((v) => v !== null && v !== undefined)
}
