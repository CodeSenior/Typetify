import type { Option } from './types'
import { some } from './some'

/**
 * Maps an Option's Some value using a function.
 * If the option is None, returns it unchanged.
 *
 * @example
 * mapOption(some(5), n => n * 2) // some(10)
 * mapOption(none(), n => n * 2) // none()
 */
export function mapOption<T, U>(
  option: Option<T>,
  fn: (value: T) => U
): Option<U> {
  if (option.some) {
    return some(fn(option.value))
  }
  return option
}
