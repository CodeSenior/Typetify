/**
 * Type-Safe Event Bus - Decoupled communication with full type safety
 */

type EventHandler<T> = (data: T) => void
type Unsubscribe = () => void

export interface EventBus<Events extends Record<string, unknown>> {
  /** Subscribe to an event */
  on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): Unsubscribe
  /** Subscribe to an event (fires only once) */
  once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): Unsubscribe
  /** Emit an event */
  emit<K extends keyof Events>(event: K, data: Events[K]): void
  /** Remove all handlers for an event */
  off<K extends keyof Events>(event: K): void
  /** Remove all handlers */
  clear(): void
  /** Get number of handlers for an event */
  listenerCount<K extends keyof Events>(event: K): number
}

/**
 * Creates a type-safe event bus for decoupled communication.
 * 
 * @example
 * // Define your events with their payload types
 * type AppEvents = {
 *   'user.login': { userId: string; timestamp: number }
 *   'user.logout': { userId: string }
 *   'order.created': { orderId: string; amount: number }
 *   'notification': string
 * }
 * 
 * const events = createEventBus<AppEvents>()
 * 
 * // Subscribe to events (fully typed!)
 * events.on('user.login', (data) => {
 *   console.log(`User ${data.userId} logged in at ${data.timestamp}`)
 * })
 * 
 * // Emit events (type-checked!)
 * events.emit('user.login', { 
 *   userId: '123', 
 *   timestamp: Date.now() 
 * })
 * 
 * // TypeScript error: missing 'timestamp'
 * events.emit('user.login', { userId: '123' })
 * 
 * // TypeScript error: unknown event
 * events.emit('unknown.event', {})
 */
export function createEventBus<
  Events extends Record<string, unknown>
>(): EventBus<Events> {
  const handlers = new Map<keyof Events, Set<EventHandler<unknown>>>()

  const getHandlers = <K extends keyof Events>(event: K): Set<EventHandler<Events[K]>> => {
    if (!handlers.has(event)) {
      handlers.set(event, new Set())
    }
    return handlers.get(event) as Set<EventHandler<Events[K]>>
  }

  return {
    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): Unsubscribe {
      const eventHandlers = getHandlers(event)
      eventHandlers.add(handler)
      return () => eventHandlers.delete(handler)
    },

    once<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>): Unsubscribe {
      const wrappedHandler: EventHandler<Events[K]> = (data) => {
        handler(data)
        getHandlers(event).delete(wrappedHandler)
      }
      return this.on(event, wrappedHandler)
    },

    emit<K extends keyof Events>(event: K, data: Events[K]): void {
      const eventHandlers = getHandlers(event)
      eventHandlers.forEach(handler => handler(data))
    },

    off<K extends keyof Events>(event: K): void {
      handlers.delete(event)
    },

    clear(): void {
      handlers.clear()
    },

    listenerCount<K extends keyof Events>(event: K): number {
      return getHandlers(event).size
    },
  }
}

/**
 * Creates a typed event emitter for a single component/class.
 * 
 * @example
 * class UserService {
 *   private events = createTypedEmitter<{
 *     created: User
 *     updated: User
 *     deleted: string
 *   }>()
 * 
 *   readonly on = this.events.on
 * 
 *   async createUser(data: CreateUserDto) {
 *     const user = await db.users.create(data)
 *     this.events.emit('created', user)
 *     return user
 *   }
 * }
 */
export function createTypedEmitter<Events extends Record<string, unknown>>() {
  return createEventBus<Events>()
}
