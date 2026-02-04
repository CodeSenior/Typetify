/**
 * Type builders for creating complex types with a fluent API.
 */

/**
 * Creates a type-safe builder pattern.
 * Allows step-by-step construction of objects with full type inference.
 *
 * @example
 * interface User { name: string; age: number }
 * const user = createBuilder<User>()
 *   .set('name', 'John')
 *   .set('age', 30)
 *   .build()
 */
export function createBuilder<T extends Record<string, unknown>>(
  initial: Partial<T> = {}
): TypeBuilder<T> {
  return {
    set<K extends keyof T>(key: K, value: T[K]): TypeBuilder<T> {
      return createBuilder<T>({ ...initial, [key]: value } as Partial<T>)
    },
    build(): T {
      return initial as T
    },
    current(): Partial<T> {
      return initial
    },
  }
}

interface TypeBuilder<T> {
  set<K extends keyof T>(key: K, value: T[K]): TypeBuilder<T>
  build(): T
  current(): Partial<T>
}

/**
 * Creates a type-safe state machine definition.
 *
 * @example
 * const machine = defineStateMachine({
 *   initial: 'idle',
 *   states: {
 *     idle: { on: { START: 'running' } },
 *     running: { on: { STOP: 'idle', PAUSE: 'paused' } },
 *     paused: { on: { RESUME: 'running', STOP: 'idle' } },
 *   },
 * })
 */
export function defineStateMachine<
  States extends string,
  Events extends string,
  Config extends StateMachineConfig<States, Events>
>(config: Config): StateMachine<States, Events, Config> {
  return {
    config,
    getInitialState: () => config.initial,
    transition: (state, event) => {
      const stateConfig = config.states[state]
      if (stateConfig && 'on' in stateConfig) {
        const nextState = (stateConfig.on as Record<string, States>)[event]
        return nextState ?? state
      }
      return state
    },
  }
}

type StateMachineConfig<States extends string, Events extends string> = {
  initial: States
  states: Record<States, { on?: Partial<Record<Events, States>> }>
}

type StateMachine<
  States extends string,
  Events extends string,
  Config extends StateMachineConfig<States, Events>
> = {
  config: Config
  getInitialState: () => Config['initial']
  transition: (state: States, event: Events) => States
}

/**
 * Creates a discriminated union type from a config object.
 *
 * @example
 * type Actions = DiscriminatedUnion<{
 *   increment: { amount: number }
 *   decrement: { amount: number }
 *   reset: {}
 * }>
 * // Results in:
 * // | { type: 'increment'; amount: number }
 * // | { type: 'decrement'; amount: number }
 * // | { type: 'reset' }
 */
export type DiscriminatedUnion<
  T extends Record<string, object>,
  TagKey extends string = 'type'
> = {
  [K in keyof T]: { [P in TagKey]: K } & T[K]
}[keyof T]

/**
 * Creates action creators from a discriminated union config.
 *
 * @example
 * const actions = createActions<{
 *   increment: { amount: number }
 *   decrement: { amount: number }
 *   reset: {}
 * }>()
 *
 * actions.increment({ amount: 5 }) // { type: 'increment', amount: 5 }
 */
export function createActions<T extends Record<string, object>>(): ActionCreators<T> {
  return new Proxy({} as ActionCreators<T>, {
    get: (_, type: string) => {
      return (payload: object) => ({ type, ...payload })
    },
  })
}

type ActionCreators<T extends Record<string, object>> = {
  [K in keyof T]: T[K] extends Record<string, never>
    ? () => { type: K }
    : (payload: T[K]) => { type: K } & T[K]
}

/**
 * Creates a type-safe event emitter.
 *
 * @example
 * const emitter = createTypedEmitter<{
 *   userCreated: { id: string; name: string }
 *   userDeleted: { id: string }
 * }>()
 *
 * emitter.on('userCreated', (data) => console.log(data.name))
 * emitter.emit('userCreated', { id: '1', name: 'John' })
 */
export function createTypedEmitter<
  Events extends Record<string, unknown>
>(): TypedEmitter<Events> {
  const listeners = new Map<keyof Events, Set<(data: unknown) => void>>()

  return {
    on<K extends keyof Events>(
      event: K,
      handler: (data: Events[K]) => void
    ): () => void {
      if (!listeners.has(event)) {
        listeners.set(event, new Set())
      }
      listeners.get(event)!.add(handler as (data: unknown) => void)
      return () => {
        listeners.get(event)?.delete(handler as (data: unknown) => void)
      }
    },

    emit<K extends keyof Events>(event: K, data: Events[K]): void {
      listeners.get(event)?.forEach((handler) => handler(data))
    },

    off<K extends keyof Events>(
      event: K,
      handler: (data: Events[K]) => void
    ): void {
      listeners.get(event)?.delete(handler as (data: unknown) => void)
    },

    clear(): void {
      listeners.clear()
    },
  }
}

type TypedEmitter<Events extends Record<string, unknown>> = {
  on<K extends keyof Events>(
    event: K,
    handler: (data: Events[K]) => void
  ): () => void
  emit<K extends keyof Events>(event: K, data: Events[K]): void
  off<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void
  clear(): void
}

/**
 * Creates a type-safe reducer.
 *
 * @example
 * const reducer = createReducer(
 *   { count: 0 },
 *   {
 *     increment: (state, action: { amount: number }) => ({
 *       count: state.count + action.amount,
 *     }),
 *     reset: () => ({ count: 0 }),
 *   }
 * )
 */
export function createReducer<
  State,
  Handlers extends Record<string, (state: State, action: any) => State>
>(
  initialState: State,
  handlers: Handlers
): {
  initialState: State
  reduce: <K extends keyof Handlers>(
    state: State,
    action: { type: K } & (Handlers[K] extends (s: State, a: infer A) => State
      ? A extends { type: unknown }
        ? Omit<A, 'type'>
        : A
      : never)
  ) => State
} {
  return {
    initialState,
    reduce: (state, action) => {
      const handler = handlers[action.type as keyof Handlers]
      if (handler) {
        return handler(state, action)
      }
      return state
    },
  }
}
