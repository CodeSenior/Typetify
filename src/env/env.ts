/**
 * Type-Safe Environment Variables
 */

type EnvSchema = Record<string, EnvVar<unknown>>

export interface EnvVar<T> {
  _type: T
  _parse: (value: string | undefined) => T
  _default?: T | undefined
}

/**
 * Environment variable type builders
 */
export const env = {
  /**
   * String environment variable
   */
  string(options?: { default?: string }): EnvVar<string> {
    return {
      _type: '' as string,
      _parse: (value) => {
        if (value === undefined) {
          if (options?.default !== undefined) return options.default
          throw new Error('Required environment variable is missing')
        }
        return value
      },
      _default: options?.default,
    }
  },

  /**
   * Number environment variable
   */
  number(options?: { default?: number }): EnvVar<number> {
    return {
      _type: 0 as number,
      _parse: (value) => {
        if (value === undefined) {
          if (options?.default !== undefined) return options.default
          throw new Error('Required environment variable is missing')
        }
        const num = Number(value)
        if (isNaN(num)) throw new Error(`Invalid number: ${value}`)
        return num
      },
      _default: options?.default,
    }
  },

  /**
   * Boolean environment variable
   */
  boolean(options?: { default?: boolean }): EnvVar<boolean> {
    return {
      _type: false as boolean,
      _parse: (value) => {
        if (value === undefined) {
          if (options?.default !== undefined) return options.default
          throw new Error('Required environment variable is missing')
        }
        return value === 'true' || value === '1' || value === 'yes'
      },
      _default: options?.default,
    }
  },

  /**
   * Enum environment variable
   */
  enum<T extends string>(values: readonly T[], options?: { default?: T }): EnvVar<T> {
    return {
      _type: '' as T,
      _parse: (value) => {
        if (value === undefined) {
          if (options?.default !== undefined) return options.default
          throw new Error('Required environment variable is missing')
        }
        if (!values.includes(value as T)) {
          throw new Error(`Invalid value: ${value}. Expected one of: ${values.join(', ')}`)
        }
        return value as T
      },
      _default: options?.default,
    }
  },

  /**
   * URL environment variable
   */
  url(options?: { default?: string }): EnvVar<string> {
    return {
      _type: '' as string,
      _parse: (value) => {
        if (value === undefined) {
          if (options?.default !== undefined) return options.default
          throw new Error('Required environment variable is missing')
        }
        try {
          new URL(value)
          return value
        } catch {
          throw new Error(`Invalid URL: ${value}`)
        }
      },
      _default: options?.default,
    }
  },

  /**
   * JSON environment variable
   */
  json<T>(options?: { default?: T }): EnvVar<T> {
    return {
      _type: {} as T,
      _parse: (value) => {
        if (value === undefined) {
          if (options?.default !== undefined) return options.default
          throw new Error('Required environment variable is missing')
        }
        try {
          return JSON.parse(value) as T
        } catch {
          throw new Error(`Invalid JSON: ${value}`)
        }
      },
      _default: options?.default,
    }
  },

  /**
   * Array environment variable (comma-separated)
   */
  array(options?: { default?: string[]; separator?: string }): EnvVar<string[]> {
    const separator = options?.separator ?? ','
    return {
      _type: [] as string[],
      _parse: (value) => {
        if (value === undefined) {
          if (options?.default !== undefined) return options.default
          throw new Error('Required environment variable is missing')
        }
        return value.split(separator).map(s => s.trim())
      },
      _default: options?.default,
    }
  },
}

type InferEnv<T extends EnvSchema> = {
  [K in keyof T]: T[K]['_type']
}

/**
 * Creates a type-safe environment configuration.
 * 
 * @example
 * const config = createEnv({
 *   DATABASE_URL: env.url(),
 *   API_KEY: env.string(),
 *   PORT: env.number({ default: 3000 }),
 *   NODE_ENV: env.enum(['development', 'production', 'test'] as const),
 *   DEBUG: env.boolean({ default: false }),
 *   ALLOWED_ORIGINS: env.array({ default: ['localhost'] }),
 * })
 * 
 * // All values are typed!
 * config.DATABASE_URL // string (validated as URL)
 * config.PORT         // number
 * config.NODE_ENV     // 'development' | 'production' | 'test'
 * config.DEBUG        // boolean
 */
export function createEnv<T extends EnvSchema>(
  schema: T,
  envSource: Record<string, string | undefined> = typeof process !== 'undefined' ? process.env : {}
): InferEnv<T> {
  const result: Record<string, unknown> = {}
  const errors: string[] = []

  for (const [key, varDef] of Object.entries(schema)) {
    try {
      result[key] = varDef._parse(envSource[key])
    } catch (error) {
      errors.push(`${key}: ${(error as Error).message}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
  }

  return result as InferEnv<T>
}
