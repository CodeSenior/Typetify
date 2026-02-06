/**
 * Type-Safe Feature Flags
 */

type FlagType = 'boolean' | 'string' | 'number'

export interface FlagConfig {
  type: FlagType
  default: unknown
}

type InferFlagType<T extends FlagType> = 
  T extends 'boolean' ? boolean :
  T extends 'string' ? string :
  T extends 'number' ? number :
  never

type FlagSchema = Record<string, FlagConfig>

type InferFlags<T extends FlagSchema> = {
  [K in keyof T]: InferFlagType<T[K]['type']>
}

/**
 * Flag type builders
 */
export const flag = {
  boolean(defaultValue = false): FlagConfig {
    return { type: 'boolean', default: defaultValue }
  },
  string(defaultValue = ''): FlagConfig {
    return { type: 'string', default: defaultValue }
  },
  number(defaultValue = 0): FlagConfig {
    return { type: 'number', default: defaultValue }
  },
}

export interface FeatureFlags<T extends FlagSchema> {
  /** Check if a boolean flag is enabled */
  is<K extends keyof T>(key: K): T[K]['type'] extends 'boolean' ? boolean : never
  /** Get a flag value */
  get<K extends keyof T>(key: K): InferFlagType<T[K]['type']>
  /** Set a flag value */
  set<K extends keyof T>(key: K, value: InferFlagType<T[K]['type']>): void
  /** Get all flags */
  all(): InferFlags<T>
  /** Reset all flags to defaults */
  reset(): void
  /** Load flags from an object */
  load(flags: Partial<InferFlags<T>>): void
}

/**
 * Creates a type-safe feature flag system.
 * 
 * @example
 * const flags = createFeatureFlags({
 *   newDashboard: flag.boolean(false),
 *   betaFeatures: flag.boolean(false),
 *   maxUploadSize: flag.number(10),
 *   theme: flag.string('light'),
 * })
 * 
 * // Check boolean flags
 * if (flags.is('newDashboard')) {
 *   renderNewDashboard()
 * }
 * 
 * // Get any flag value
 * const maxSize = flags.get('maxUploadSize') // number
 * const theme = flags.get('theme') // string
 * 
 * // Set flags
 * flags.set('betaFeatures', true)
 * flags.set('maxUploadSize', 50)
 * 
 * // Load from config/API
 * flags.load({
 *   newDashboard: true,
 *   maxUploadSize: 100,
 * })
 */
export function createFeatureFlags<T extends FlagSchema>(
  schema: T
): FeatureFlags<T> {
  const values: Record<string, unknown> = {}
  
  // Initialize with defaults
  for (const [key, config] of Object.entries(schema)) {
    values[key] = config.default
  }

  return {
    is(key) {
      const config = schema[key as string]
      if (config?.type !== 'boolean') {
        throw new Error(`Flag '${String(key)}' is not a boolean flag`)
      }
      return values[key as string] as ReturnType<FeatureFlags<T>['is']>
    },

    get(key) {
      return values[key as string] as InferFlagType<T[typeof key]['type']>
    },

    set(key, value) {
      values[key as string] = value
    },

    all() {
      return { ...values } as InferFlags<T>
    },

    reset() {
      for (const [key, config] of Object.entries(schema)) {
        values[key] = config.default
      }
    },

    load(flags) {
      for (const [key, value] of Object.entries(flags)) {
        if (key in schema && value !== undefined) {
          values[key] = value
        }
      }
    },
  }
}
