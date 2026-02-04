/**
 * Deep Path Access with Full Type Safety
 * 
 * This is the most technically complex feature in Typetify.
 * It provides type-safe access to nested properties using string paths like "user.profile.settings.theme"
 */

/**
 * Splits a dot-separated path string into a tuple of keys.
 * "a.b.c" -> ["a", "b", "c"]
 */
type Split<S extends string, D extends string = '.'> = 
  S extends `${infer T}${D}${infer U}` 
    ? [T, ...Split<U, D>] 
    : [S]

/**
 * Gets the type at a specific path in an object.
 * Handles optional properties, arrays, and nested objects.
 */
type GetByPath<T, Path extends readonly string[]> = 
  Path extends readonly [] 
    ? T
    : Path extends readonly [infer First extends string, ...infer Rest extends string[]]
      ? First extends keyof NonNullable<T>
        ? T extends null | undefined
          ? GetByPath<NonNullable<T>[First], Rest> | undefined
          : GetByPath<NonNullable<T>[First], Rest>
        : undefined
      : never

/**
 * Gets the type at a dot-separated string path.
 */
type PathValue<T, P extends string> = GetByPath<T, Split<P>>

/**
 * Generates all valid paths for an object type.
 * Limited depth to prevent infinite recursion.
 */
type Paths<T, Depth extends number = 5> = Depth extends 0
  ? never
  : T extends object
    ? {
        [K in keyof T & string]: T[K] extends object
          ? K | `${K}.${Paths<T[K], Prev[Depth]>}`
          : K
      }[keyof T & string]
    : never

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

/**
 * Type-safe deep property access using dot notation.
 * 
 * This solves the pain point of accessing nested properties safely
 * while maintaining full type inference.
 * 
 * @example
 * interface User {
 *   id: number
 *   profile: {
 *     name: string
 *     settings: {
 *       theme: 'light' | 'dark'
 *       notifications: boolean
 *     }
 *   }
 * }
 * 
 * const user: User = { ... }
 * 
 * // Fully type-safe!
 * const theme = deepGet(user, 'profile.settings.theme')
 * // Type: 'light' | 'dark'
 * 
 * // TypeScript error: invalid path
 * const invalid = deepGet(user, 'profile.invalid.path')
 * 
 * @example
 * // With optional properties
 * interface Config {
 *   database?: {
 *     host: string
 *     port: number
 *   }
 * }
 * 
 * const host = deepGet(config, 'database.host')
 * // Type: string | undefined
 */
export function deepGet<T extends object, P extends string & Paths<T>>(
  obj: T,
  path: P
): PathValue<T, P> {
  const keys = path.split('.') as string[]
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined as PathValue<T, P>
    }
    if (typeof current !== 'object') {
      return undefined as PathValue<T, P>
    }
    current = (current as Record<string, unknown>)[key]
  }

  return current as PathValue<T, P>
}

/**
 * Deep get with a default value if the path doesn't exist or is undefined.
 * 
 * @example
 * const theme = deepGetOr(user, 'profile.settings.theme', 'light')
 * // Type: 'light' | 'dark' (never undefined)
 */
export function deepGetOr<T extends object, P extends string & Paths<T>, D>(
  obj: T,
  path: P,
  defaultValue: D
): NonNullable<PathValue<T, P>> | D {
  const value = deepGet(obj, path)
  return (value ?? defaultValue) as NonNullable<PathValue<T, P>> | D
}

/**
 * Type-safe deep property setter.
 * Returns a new object with the property set (immutable).
 * 
 * @example
 * const updated = deepSet(user, 'profile.settings.theme', 'dark')
 * // Returns new object, original unchanged
 */
export function deepSet<T extends object, P extends string & Paths<T>>(
  obj: T,
  path: P,
  value: PathValue<T, P>
): T {
  const keys = path.split('.')
  const result = structuredClone(obj)
  
  let current: Record<string, unknown> = result as Record<string, unknown>
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]!
    if (current[key] === undefined || current[key] === null) {
      current[key] = {}
    }
    current = current[key] as Record<string, unknown>
  }
  
  const lastKey = keys[keys.length - 1]!
  current[lastKey] = value
  return result
}

/**
 * Checks if a path exists in an object (value is not undefined).
 * 
 * @example
 * if (deepHas(user, 'profile.settings.theme')) {
 *   // path exists
 * }
 */
export function deepHas<T extends object, P extends string & Paths<T>>(
  obj: T,
  path: P
): boolean {
  return deepGet(obj, path) !== undefined
}

/**
 * Creates a getter function for a specific path.
 * Useful for repeated access or in pipelines.
 * 
 * @example
 * const getTheme = deepPath<User>()('profile.settings.theme')
 * 
 * users.map(getTheme)
 * // Type: ('light' | 'dark')[]
 */
export function deepPath<T extends object>() {
  return <P extends string & Paths<T>>(path: P) => {
    return (obj: T): PathValue<T, P> => deepGet(obj, path)
  }
}

/**
 * Plucks a nested property from an array of objects.
 * 
 * @example
 * const themes = deepPluck(users, 'profile.settings.theme')
 * // Type: ('light' | 'dark')[]
 */
export function deepPluck<T extends object, P extends string & Paths<T>>(
  array: readonly T[],
  path: P
): PathValue<T, P>[] {
  return array.map(obj => deepGet(obj, path))
}

export type { Paths, PathValue, Split, GetByPath }
