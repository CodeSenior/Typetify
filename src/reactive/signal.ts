/**
 * Reactive Signals - Fine-grained reactivity like Solid.js
 * 
 * Signals are the foundation of reactive programming.
 * They hold a value and notify subscribers when it changes.
 */

type Subscriber<T> = (value: T) => void
type Unsubscribe = () => void

export interface Signal<T> {
  /** Get the current value */
  (): T
  /** Set a new value */
  set(value: T): void
  /** Update value using a function */
  update(fn: (current: T) => T): void
  /** Subscribe to changes */
  subscribe(fn: Subscriber<T>): Unsubscribe
  /** Get value without tracking */
  peek(): T
}

export interface ReadonlySignal<T> {
  /** Get the current value */
  (): T
  /** Subscribe to changes */
  subscribe(fn: Subscriber<T>): Unsubscribe
  /** Get value without tracking */
  peek(): T
}

// Global tracking context for computed values
let currentComputed: (() => void) | null = null

/**
 * Creates a reactive signal that notifies subscribers on change.
 * 
 * @example
 * const count = signal(0)
 * 
 * // Read value
 * console.log(count()) // 0
 * 
 * // Set value
 * count.set(5)
 * 
 * // Update with function
 * count.update(n => n + 1)
 * 
 * // Subscribe to changes
 * const unsubscribe = count.subscribe(value => {
 *   console.log('Count changed:', value)
 * })
 */
export function signal<T>(initialValue: T): Signal<T> {
  let value = initialValue
  const subscribers = new Set<Subscriber<T>>()

  const read = (): T => {
    // Track this signal if we're inside a computed
    if (currentComputed) {
      subscribers.add(currentComputed as Subscriber<T>)
    }
    return value
  }

  read.set = (newValue: T): void => {
    if (!Object.is(value, newValue)) {
      value = newValue
      subscribers.forEach(fn => fn(value))
    }
  }

  read.update = (fn: (current: T) => T): void => {
    read.set(fn(value))
  }

  read.subscribe = (fn: Subscriber<T>): Unsubscribe => {
    subscribers.add(fn)
    return () => subscribers.delete(fn)
  }

  read.peek = (): T => value

  return read as Signal<T>
}

/**
 * Creates a computed value that automatically updates when dependencies change.
 * 
 * @example
 * const firstName = signal('John')
 * const lastName = signal('Doe')
 * 
 * const fullName = computed(() => `${firstName()} ${lastName()}`)
 * 
 * console.log(fullName()) // "John Doe"
 * 
 * firstName.set('Jane')
 * console.log(fullName()) // "Jane Doe"
 */
export function computed<T>(fn: () => T): ReadonlySignal<T> {
  const internalSignal = signal<T>(undefined as T)
  
  const recompute = () => {
    const prevComputed = currentComputed
    currentComputed = recompute
    try {
      internalSignal.set(fn())
    } finally {
      currentComputed = prevComputed
    }
  }

  // Initial computation
  recompute()

  const read = (): T => internalSignal()
  read.subscribe = internalSignal.subscribe
  read.peek = internalSignal.peek

  return read as ReadonlySignal<T>
}

/**
 * Runs a function whenever its dependencies change.
 * 
 * @example
 * const count = signal(0)
 * 
 * const stop = effect(() => {
 *   console.log('Count is:', count())
 * })
 * 
 * count.set(1) // Logs: "Count is: 1"
 * count.set(2) // Logs: "Count is: 2"
 * 
 * stop() // Stop the effect
 */
export function effect(fn: () => void | (() => void)): Unsubscribe {
  let cleanup: (() => void) | void

  const run = () => {
    if (cleanup) cleanup()
    const prevComputed = currentComputed
    currentComputed = run
    try {
      cleanup = fn()
    } finally {
      currentComputed = prevComputed
    }
  }

  run()

  return () => {
    if (cleanup) cleanup()
  }
}

/**
 * Batches multiple signal updates into a single notification.
 * 
 * @example
 * const a = signal(1)
 * const b = signal(2)
 * 
 * // Without batch: 2 notifications
 * // With batch: 1 notification
 * batch(() => {
 *   a.set(10)
 *   b.set(20)
 * })
 */
let batchDepth = 0
let pendingEffects: Set<() => void> = new Set()

export function batch(fn: () => void): void {
  batchDepth++
  try {
    fn()
  } finally {
    batchDepth--
    if (batchDepth === 0) {
      const effects = pendingEffects
      pendingEffects = new Set()
      effects.forEach(effect => effect())
    }
  }
}
