/**
 * Type-Safe Collection with Auto-Generated CRUD
 * 
 * Define a model once, get a fully typed collection for free.
 * Includes persistence (localStorage/API) and smart filtering.
 * 
 * @example
 * const User = v.object({
 *   id: v.number(),
 *   name: v.string(),
 *   role: v.enum('admin', 'user'),
 * })
 * 
 * const Users = collection(User)
 * 
 * Users.add({ id: 1, name: 'Alice', role: 'admin' })
 * const admin = Users.find('role', 'admin')
 * const names = Users.pluck('name')
 */

import type { Validator, ObjectValidator } from './v'

// =============================================================================
// COLLECTION TYPES
// =============================================================================

export interface Collection<T> {
  /** All items in the collection */
  readonly items: readonly T[]
  
  /** Number of items */
  readonly length: number
  
  /** Add an item (returns the added item) */
  add(item: T): T
  
  /** Add multiple items */
  addMany(items: T[]): T[]
  
  /** Update an item by predicate */
  update(predicate: (item: T) => boolean, updates: Partial<T>): T | undefined
  
  /** Update item by key value */
  updateWhere<K extends keyof T>(key: K, value: T[K], updates: Partial<T>): T | undefined
  
  /** Remove items matching predicate */
  remove(predicate: (item: T) => boolean): T[]
  
  /** Remove item by key value */
  removeWhere<K extends keyof T>(key: K, value: T[K]): T | undefined
  
  /** Clear all items */
  clear(): void
  
  /** Find first item matching predicate */
  findOne(predicate: (item: T) => boolean): T | undefined
  
  /** Find item by key value */
  find<K extends keyof T>(key: K, value: T[K]): T | undefined
  
  /** Find all items matching predicate */
  findMany(predicate: (item: T) => boolean): T[]
  
  /** Filter items (alias for findMany) */
  where(predicate: (item: T) => boolean): T[]
  
  /** Filter by key value */
  whereEquals<K extends keyof T>(key: K, value: T[K]): T[]
  
  /** Check if any item matches */
  some(predicate: (item: T) => boolean): boolean
  
  /** Check if all items match */
  every(predicate: (item: T) => boolean): boolean
  
  /** Check if collection contains item with key value */
  has<K extends keyof T>(key: K, value: T[K]): boolean
  
  /** Get first item */
  first(): T | undefined
  
  /** Get last item */
  last(): T | undefined
  
  /** Get item at index */
  at(index: number): T | undefined
  
  /** Map items to new values */
  map<U>(fn: (item: T, index: number) => U): U[]
  
  /** Extract single property from all items */
  pluck<K extends keyof T>(key: K): T[K][]
  
  /** Pick specific properties from all items */
  pick<K extends keyof T>(...keys: K[]): Pick<T, K>[]
  
  /** Omit specific properties from all items */
  omit<K extends keyof T>(...keys: K[]): Omit<T, K>[]
  
  /** Sort items (returns new array) */
  sortBy<K extends keyof T>(key: K, order?: 'asc' | 'desc'): T[]
  
  /** Group items by key */
  groupBy<K extends keyof T>(key: K): Map<T[K], T[]>
  
  /** Get unique values for a key */
  unique<K extends keyof T>(key: K): T[K][]
  
  /** Count items matching predicate */
  count(predicate?: (item: T) => boolean): number
  
  /** Subscribe to changes */
  subscribe(listener: (items: readonly T[]) => void): () => void
  
  /** Convert to array */
  toArray(): T[]
  
  /** Convert to JSON string */
  toJSON(): string
  
  /** Load from JSON string */
  fromJSON(json: string): void
}

export interface CollectionWithId<T, IdKey extends keyof T> extends Collection<T> {
  /** Find item by ID */
  byId(id: T[IdKey]): T | undefined
  
  /** Update item by ID */
  updateById(id: T[IdKey], updates: Partial<T>): T | undefined
  
  /** Remove item by ID */
  removeById(id: T[IdKey]): T | undefined
  
  /** Check if ID exists */
  hasId(id: T[IdKey]): boolean
}

export interface PersistentCollection<T> extends Collection<T> {
  /** Save to storage */
  save(): Promise<void>
  
  /** Load from storage */
  load(): Promise<void>
  
  /** Enable auto-save on changes */
  enableAutoSave(): void
  
  /** Disable auto-save */
  disableAutoSave(): void
}

// =============================================================================
// COLLECTION IMPLEMENTATION
// =============================================================================

class CollectionImpl<T> implements Collection<T> {
  private _items: T[] = []
  private _listeners: Set<(items: readonly T[]) => void> = new Set()
  
  get items(): readonly T[] {
    return this._items
  }
  
  get length(): number {
    return this._items.length
  }
  
  private notify(): void {
    for (const listener of this._listeners) {
      listener(this._items)
    }
  }
  
  add(item: T): T {
    this._items.push(item)
    this.notify()
    return item
  }
  
  addMany(items: T[]): T[] {
    this._items.push(...items)
    this.notify()
    return items
  }
  
  update(predicate: (item: T) => boolean, updates: Partial<T>): T | undefined {
    const index = this._items.findIndex(predicate)
    if (index === -1) return undefined
    this._items[index] = { ...this._items[index], ...updates } as T
    this.notify()
    return this._items[index]
  }
  
  updateWhere<K extends keyof T>(key: K, value: T[K], updates: Partial<T>): T | undefined {
    return this.update((item) => item[key] === value, updates)
  }
  
  remove(predicate: (item: T) => boolean): T[] {
    const removed: T[] = []
    this._items = this._items.filter((item) => {
      if (predicate(item)) {
        removed.push(item)
        return false
      }
      return true
    })
    if (removed.length > 0) this.notify()
    return removed
  }
  
  removeWhere<K extends keyof T>(key: K, value: T[K]): T | undefined {
    const removed = this.remove((item) => item[key] === value)
    return removed[0]
  }
  
  clear(): void {
    this._items = []
    this.notify()
  }
  
  findOne(predicate: (item: T) => boolean): T | undefined {
    return this._items.find(predicate)
  }
  
  find<K extends keyof T>(key: K, value: T[K]): T | undefined {
    return this._items.find((item) => item[key] === value)
  }
  
  findMany(predicate: (item: T) => boolean): T[] {
    return this._items.filter(predicate)
  }
  
  where(predicate: (item: T) => boolean): T[] {
    return this.findMany(predicate)
  }
  
  whereEquals<K extends keyof T>(key: K, value: T[K]): T[] {
    return this._items.filter((item) => item[key] === value)
  }
  
  some(predicate: (item: T) => boolean): boolean {
    return this._items.some(predicate)
  }
  
  every(predicate: (item: T) => boolean): boolean {
    return this._items.every(predicate)
  }
  
  has<K extends keyof T>(key: K, value: T[K]): boolean {
    return this._items.some((item) => item[key] === value)
  }
  
  first(): T | undefined {
    return this._items[0]
  }
  
  last(): T | undefined {
    return this._items[this._items.length - 1]
  }
  
  at(index: number): T | undefined {
    return this._items.at(index)
  }
  
  map<U>(fn: (item: T, index: number) => U): U[] {
    return this._items.map(fn)
  }
  
  pluck<K extends keyof T>(key: K): T[K][] {
    return this._items.map((item) => item[key])
  }
  
  pick<K extends keyof T>(...keys: K[]): Pick<T, K>[] {
    return this._items.map((item) => {
      const picked = {} as Pick<T, K>
      for (const key of keys) {
        picked[key] = item[key]
      }
      return picked
    })
  }
  
  omit<K extends keyof T>(...keys: K[]): Omit<T, K>[] {
    return this._items.map((item) => {
      const omitted = { ...item }
      for (const key of keys) {
        delete (omitted as Record<string, unknown>)[key as string]
      }
      return omitted as Omit<T, K>
    })
  }
  
  sortBy<K extends keyof T>(key: K, order: 'asc' | 'desc' = 'asc'): T[] {
    return [...this._items].sort((a, b) => {
      const aVal = a[key]
      const bVal = b[key]
      if (aVal < bVal) return order === 'asc' ? -1 : 1
      if (aVal > bVal) return order === 'asc' ? 1 : -1
      return 0
    })
  }
  
  groupBy<K extends keyof T>(key: K): Map<T[K], T[]> {
    const groups = new Map<T[K], T[]>()
    for (const item of this._items) {
      const groupKey = item[key]
      const group = groups.get(groupKey) || []
      group.push(item)
      groups.set(groupKey, group)
    }
    return groups
  }
  
  unique<K extends keyof T>(key: K): T[K][] {
    return [...new Set(this._items.map((item) => item[key]))]
  }
  
  count(predicate?: (item: T) => boolean): number {
    if (!predicate) return this._items.length
    return this._items.filter(predicate).length
  }
  
  subscribe(listener: (items: readonly T[]) => void): () => void {
    this._listeners.add(listener)
    return () => this._listeners.delete(listener)
  }
  
  toArray(): T[] {
    return [...this._items]
  }
  
  toJSON(): string {
    return JSON.stringify(this._items)
  }
  
  fromJSON(json: string): void {
    this._items = JSON.parse(json)
    this.notify()
  }
}

// =============================================================================
// COLLECTION WITH ID
// =============================================================================

class CollectionWithIdImpl<T, IdKey extends keyof T> 
  extends CollectionImpl<T> 
  implements CollectionWithId<T, IdKey> 
{
  constructor(private idKey: IdKey) {
    super()
  }
  
  byId(id: T[IdKey]): T | undefined {
    return this.find(this.idKey, id)
  }
  
  updateById(id: T[IdKey], updates: Partial<T>): T | undefined {
    return this.updateWhere(this.idKey, id, updates)
  }
  
  removeById(id: T[IdKey]): T | undefined {
    return this.removeWhere(this.idKey, id)
  }
  
  hasId(id: T[IdKey]): boolean {
    return this.has(this.idKey, id)
  }
}

// =============================================================================
// PERSISTENT COLLECTION
// =============================================================================

interface StorageAdapter {
  get(key: string): Promise<string | null>
  set(key: string, value: string): Promise<void>
  remove(key: string): Promise<void>
}

const localStorageAdapter: StorageAdapter = {
  async get(key: string) {
    if (typeof localStorage === 'undefined') return null
    return localStorage.getItem(key)
  },
  async set(key: string, value: string) {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(key, value)
  },
  async remove(key: string) {
    if (typeof localStorage === 'undefined') return
    localStorage.removeItem(key)
  },
}

class PersistentCollectionImpl<T> 
  extends CollectionImpl<T> 
  implements PersistentCollection<T> 
{
  private autoSaveEnabled = false
  private unsubscribe?: () => void
  
  constructor(
    private storageKey: string,
    private storage: StorageAdapter = localStorageAdapter
  ) {
    super()
  }
  
  async save(): Promise<void> {
    await this.storage.set(this.storageKey, this.toJSON())
  }
  
  async load(): Promise<void> {
    const data = await this.storage.get(this.storageKey)
    if (data) {
      this.fromJSON(data)
    }
  }
  
  enableAutoSave(): void {
    if (this.autoSaveEnabled) return
    this.autoSaveEnabled = true
    this.unsubscribe = this.subscribe(() => {
      void this.save()
    })
  }
  
  disableAutoSave(): void {
    this.autoSaveEnabled = false
    this.unsubscribe?.()
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create a typed collection from a validator.
 * 
 * @example
 * const User = v.object({ id: v.number(), name: v.string() })
 * const Users = collection(User)
 * 
 * Users.add({ id: 1, name: 'Alice' }) // Fully typed!
 * Users.find('name', 'Alice') // Autocomplete on 'name', 'id'
 */
export function collection<T>(
  _validator: Validator<T>
): Collection<T> {
  return new CollectionImpl<T>()
}

/**
 * Create a typed collection with ID-based operations.
 * 
 * @example
 * const User = v.object({ id: v.number(), name: v.string() })
 * const Users = collectionWithId(User, 'id')
 * 
 * Users.byId(1) // Find by ID
 * Users.updateById(1, { name: 'Bob' }) // Update by ID
 * Users.removeById(1) // Remove by ID
 */
export function collectionWithId<
  T,
  IdKey extends keyof T
>(
  _validator: Validator<T>,
  idKey: IdKey
): CollectionWithId<T, IdKey> {
  return new CollectionWithIdImpl<T, IdKey>(idKey)
}

/**
 * Create a persistent collection that saves to storage.
 * 
 * @example
 * const User = v.object({ id: v.number(), name: v.string() })
 * const Users = persistentCollection(User, 'users')
 * 
 * await Users.load() // Load from localStorage
 * Users.add({ id: 1, name: 'Alice' })
 * await Users.save() // Save to localStorage
 * 
 * // Or enable auto-save
 * Users.enableAutoSave()
 */
export function persistentCollection<T>(
  _validator: Validator<T>,
  storageKey: string,
  storage?: StorageAdapter
): PersistentCollection<T> {
  return new PersistentCollectionImpl<T>(storageKey, storage)
}

/**
 * Create a collection from an object validator with all features.
 * This is the recommended way to create collections.
 * 
 * @example
 * const User = v.object({
 *   id: v.number(),
 *   name: v.string(),
 *   role: v.enum('admin', 'user'),
 * })
 * 
 * const Users = createCollection(User, {
 *   idKey: 'id',
 *   persist: 'users', // localStorage key
 *   autoSave: true,
 * })
 */
export function createCollection<
  S extends Record<string, Validator<unknown>>
>(
  _validator: ObjectValidator<S>,
  options?: {
    idKey?: keyof S
    persist?: string
    autoSave?: boolean
    storage?: StorageAdapter
  }
): Collection<{ [K in keyof S]: S[K]['T'] }> {
  
  type T = { [K in keyof S]: S[K]['T'] }
  
  if (options?.persist) {
    const col = new PersistentCollectionImpl<T>(options.persist, options.storage)
    if (options.autoSave) col.enableAutoSave()
    return col
  }
  
  if (options?.idKey) {
    return new CollectionWithIdImpl<T, keyof T>(options.idKey as keyof T)
  }
  
  return new CollectionImpl<T>()
}
