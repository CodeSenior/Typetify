/**
 * Dependency Injection Container - Type-safe DI with automatic resolution
 */

type Factory<T> = (container: Container) => T
type ServiceKey = string | symbol

interface ServiceDescriptor<T> {
  factory: Factory<T>
  singleton: boolean
  instance?: T
}

export interface Container {
  /** Register a service factory */
  register<T>(key: ServiceKey, factory: Factory<T>): Container
  /** Register a singleton service */
  singleton<T>(key: ServiceKey, factory: Factory<T>): Container
  /** Register a constant value */
  constant<T>(key: ServiceKey, value: T): Container
  /** Resolve a service by key */
  resolve<T>(key: ServiceKey): T
  /** Check if a service is registered */
  has(key: ServiceKey): boolean
  /** Create a child container */
  createChild(): Container
}

/**
 * Creates a dependency injection container.
 * 
 * @example
 * // Define your services
 * class Logger {
 *   log(msg: string) { console.log(msg) }
 * }
 * 
 * class Database {
 *   constructor(private logger: Logger) {}
 *   query(sql: string) {
 *     this.logger.log(`Executing: ${sql}`)
 *     return []
 *   }
 * }
 * 
 * class UserService {
 *   constructor(private db: Database) {}
 *   getUsers() {
 *     return this.db.query('SELECT * FROM users')
 *   }
 * }
 * 
 * // Create container and register services
 * const container = createContainer()
 *   .singleton('logger', () => new Logger())
 *   .singleton('db', (c) => new Database(c.resolve('logger')))
 *   .register('userService', (c) => new UserService(c.resolve('db')))
 * 
 * // Resolve services
 * const userService = container.resolve<UserService>('userService')
 * userService.getUsers()
 * 
 * @example
 * // With constants
 * const container = createContainer()
 *   .constant('apiUrl', 'https://api.example.com')
 *   .constant('apiKey', process.env.API_KEY)
 *   .singleton('api', (c) => new ApiClient(
 *     c.resolve('apiUrl'),
 *     c.resolve('apiKey')
 *   ))
 */
export function createContainer(parent?: Container): Container {
  const services = new Map<ServiceKey, ServiceDescriptor<unknown>>()

  const container: Container = {
    register<T>(key: ServiceKey, factory: Factory<T>): Container {
      services.set(key, { factory, singleton: false })
      return container
    },

    singleton<T>(key: ServiceKey, factory: Factory<T>): Container {
      services.set(key, { factory, singleton: true })
      return container
    },

    constant<T>(key: ServiceKey, value: T): Container {
      services.set(key, { 
        factory: () => value, 
        singleton: true, 
        instance: value 
      })
      return container
    },

    resolve<T>(key: ServiceKey): T {
      const descriptor = services.get(key) as ServiceDescriptor<T> | undefined

      if (!descriptor) {
        if (parent) {
          return parent.resolve<T>(key)
        }
        throw new Error(`Service not found: ${String(key)}`)
      }

      if (descriptor.singleton) {
        if (descriptor.instance === undefined) {
          descriptor.instance = descriptor.factory(container)
        }
        return descriptor.instance as T
      }

      return descriptor.factory(container) as T
    },

    has(key: ServiceKey): boolean {
      return services.has(key) || (parent?.has(key) ?? false)
    },

    createChild(): Container {
      return createContainer(container)
    },
  }

  return container
}

/**
 * Creates a typed container with predefined service types.
 * 
 * @example
 * interface Services {
 *   logger: Logger
 *   db: Database
 *   userService: UserService
 * }
 * 
 * const container = createTypedContainer<Services>()
 *   .singleton('logger', () => new Logger())
 *   .singleton('db', (c) => new Database(c.resolve('logger')))
 * 
 * // Fully typed!
 * const logger = container.resolve('logger') // Type: Logger
 */
export function createTypedContainer<Services extends Record<string, unknown>>(): {
  register<K extends keyof Services>(
    key: K,
    factory: (container: { resolve<K2 extends keyof Services>(key: K2): Services[K2] }) => Services[K]
  ): ReturnType<typeof createTypedContainer<Services>>
  singleton<K extends keyof Services>(
    key: K,
    factory: (container: { resolve<K2 extends keyof Services>(key: K2): Services[K2] }) => Services[K]
  ): ReturnType<typeof createTypedContainer<Services>>
  constant<K extends keyof Services>(key: K, value: Services[K]): ReturnType<typeof createTypedContainer<Services>>
  resolve<K extends keyof Services>(key: K): Services[K]
  has(key: keyof Services): boolean
} {
  const container = createContainer()
  
  return {
    register(key, factory) {
      container.register(key as string, factory as Factory<unknown>)
      return this
    },
    singleton(key, factory) {
      container.singleton(key as string, factory as Factory<unknown>)
      return this
    },
    constant(key, value) {
      container.constant(key as string, value)
      return this
    },
    resolve(key) {
      return container.resolve(key as string)
    },
    has(key) {
      return container.has(key as string)
    },
  }
}
