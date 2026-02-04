/**
 * Result type for operations that can fail.
 * Similar to Rust's Result<T, E>.
 */
export type Result<T, E = Error> = Ok<T> | Err<E>

export interface Ok<T> {
  readonly ok: true
  readonly value: T
  readonly error?: never
}

export interface Err<E> {
  readonly ok: false
  readonly value?: never
  readonly error: E
}

/**
 * Option type for values that may or may not exist.
 * Similar to Rust's Option<T>.
 */
export type Option<T> = Some<T> | None

export interface Some<T> {
  readonly some: true
  readonly value: T
}

export interface None {
  readonly some: false
  readonly value?: never
}
