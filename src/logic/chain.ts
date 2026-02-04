/**
 * Chains operations on a value, stopping if any returns null/undefined.
 * Replaces: `a?.method1()?.method2()?.method3()`
 *
 * @example
 * const result = chain(user)
 *   .map(u => u.profile)
 *   .map(p => p.settings)
 *   .map(s => s.theme)
 *   .value()
 *
 * // Instead of:
 * const result = user?.profile?.settings?.theme
 */
export function chain<T>(value: T | null | undefined): Chain<T> {
  return {
    map<U>(fn: (v: T) => U | null | undefined): Chain<U> {
      if (value === null || value === undefined) {
        return chain<U>(undefined)
      }
      return chain(fn(value))
    },

    flatMap<U>(fn: (v: T) => Chain<U>): Chain<U> {
      if (value === null || value === undefined) {
        return chain<U>(undefined)
      }
      return fn(value)
    },

    filter(predicate: (v: T) => boolean): Chain<T> {
      if (value === null || value === undefined) {
        return chain<T>(undefined)
      }
      return predicate(value) ? chain(value) : chain<T>(undefined)
    },

    tap(fn: (v: T) => void): Chain<T> {
      if (value !== null && value !== undefined) {
        fn(value)
      }
      return chain(value)
    },

    value(): T | undefined {
      return value ?? undefined
    },

    valueOr<D>(defaultValue: D): T | D {
      return value ?? defaultValue
    },

    valueOrThrow(message?: string): T {
      if (value === null || value === undefined) {
        throw new Error(message ?? 'Value is null or undefined')
      }
      return value
    },
  }
}

interface Chain<T> {
  map<U>(fn: (v: T) => U | null | undefined): Chain<U>
  flatMap<U>(fn: (v: T) => Chain<U>): Chain<U>
  filter(predicate: (v: T) => boolean): Chain<T>
  tap(fn: (v: T) => void): Chain<T>
  value(): T | undefined
  valueOr<D>(defaultValue: D): T | D
  valueOrThrow(message?: string): T
}

export type { Chain }
