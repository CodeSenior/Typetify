import type { Option } from './types'
import { some } from './some'
import { none } from './none'

/**
 * Creates an Option from a nullable value.
 * Returns Some if the value is not null/undefined, None otherwise.
 *
 * @example
 * fromNullable(5) // some(5)
 * fromNullable(null) // none()
 * fromNullable(undefined) // none()
 */
export function fromNullable<T>(value: T | null | undefined): Option<NonNullable<T>> {
  if (value === null || value === undefined) {
    return none()
  }
  return some(value as NonNullable<T>)
}
