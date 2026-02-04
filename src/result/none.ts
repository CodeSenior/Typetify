import type { None } from './types'

/**
 * Creates a None option representing absence of a value.
 *
 * @example
 * const option = none()
 * option.some // false
 */
export function none(): None {
  return { some: false }
}
