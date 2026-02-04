/**
 * Meta-Types for Common State Patterns
 * 
 * Pre-built type templates that solve common business logic problems.
 * No more isLoading: boolean + isError: boolean = impossible states!
 */

import type { Prettify } from './types'

// =============================================================================
// ASYNC DATA STATE
// =============================================================================

/**
 * Type-safe async data state.
 * Eliminates impossible states like { isLoading: true, data: User }.
 * 
 * @example
 * type UserState = AsyncData<User>
 * 
 * // The type is EXACTLY ONE OF:
 * // { status: 'idle' }
 * // { status: 'loading' }
 * // { status: 'success'; data: User }
 * // { status: 'error'; error: Error }
 * 
 * function render(state: UserState) {
 *   switch (state.status) {
 *     case 'idle': return 'Ready to load'
 *     case 'loading': return 'Loading...'
 *     case 'success': return `Hello ${state.data.name}`
 *     case 'error': return `Error: ${state.error.message}`
 *   }
 * }
 */
export type AsyncData<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E }

/**
 * AsyncData with refresh capability.
 * Tracks if data is being refreshed while showing stale data.
 */
export type AsyncDataWithRefresh<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T; isRefreshing: boolean }
  | { status: 'error'; error: E; isRetrying: boolean }

/**
 * Create async data state helpers.
 * 
 * @example
 * const userState = asyncData<User>()
 * 
 * let state = userState.idle()
 * state = userState.loading()
 * state = userState.success({ id: 1, name: 'John' })
 * state = userState.error(new Error('Failed'))
 */
export function asyncData<T, E = Error>(): AsyncDataHelpers<T, E> {
  return {
    idle: () => ({ status: 'idle' }),
    loading: () => ({ status: 'loading' }),
    success: (data) => ({ status: 'success', data }),
    error: (error) => ({ status: 'error', error }),
    
    isIdle: (state): state is { status: 'idle' } => state.status === 'idle',
    isLoading: (state): state is { status: 'loading' } => state.status === 'loading',
    isSuccess: (state): state is { status: 'success'; data: T } => state.status === 'success',
    isError: (state): state is { status: 'error'; error: E } => state.status === 'error',
    
    map: (state, fn) => {
      if (state.status === 'success') {
        return { status: 'success', data: fn(state.data) }
      }
      return state as AsyncData<never, E>
    },
    
    getOrElse: (state, defaultValue) => {
      if (state.status === 'success') {
        return state.data
      }
      return defaultValue
    },
  }
}

interface AsyncDataHelpers<T, E> {
  idle(): { status: 'idle' }
  loading(): { status: 'loading' }
  success(data: T): { status: 'success'; data: T }
  error(error: E): { status: 'error'; error: E }
  
  isIdle(state: AsyncData<T, E>): state is { status: 'idle' }
  isLoading(state: AsyncData<T, E>): state is { status: 'loading' }
  isSuccess(state: AsyncData<T, E>): state is { status: 'success'; data: T }
  isError(state: AsyncData<T, E>): state is { status: 'error'; error: E }
  
  map<U>(state: AsyncData<T, E>, fn: (data: T) => U): AsyncData<U, E>
  getOrElse(state: AsyncData<T, E>, defaultValue: T): T
}

// =============================================================================
// FORM STATE
// =============================================================================

/**
 * Type-safe form state.
 * Tracks form lifecycle from pristine to submitted.
 * 
 * @example
 * type LoginForm = FormState<{ email: string; password: string }>
 * 
 * // States:
 * // { status: 'pristine'; values: FormValues }
 * // { status: 'dirty'; values: FormValues; touched: Set<keyof FormValues> }
 * // { status: 'validating'; values: FormValues }
 * // { status: 'invalid'; values: FormValues; errors: Record<keyof FormValues, string> }
 * // { status: 'submitting'; values: FormValues }
 * // { status: 'submitted'; values: FormValues }
 * // { status: 'error'; values: FormValues; error: Error }
 */
export type FormState<T extends Record<string, unknown>> =
  | { status: 'pristine'; values: T }
  | { status: 'dirty'; values: T; touched: Set<keyof T> }
  | { status: 'validating'; values: T }
  | { status: 'invalid'; values: T; errors: Partial<Record<keyof T, string>> }
  | { status: 'submitting'; values: T }
  | { status: 'submitted'; values: T }
  | { status: 'error'; values: T; error: Error }

/**
 * Create form state helpers.
 */
export function formState<T extends Record<string, unknown>>(
  initialValues: T
): FormStateHelpers<T> {
  return {
    pristine: () => ({ status: 'pristine', values: initialValues }),
    dirty: (values, touched) => ({ status: 'dirty', values, touched }),
    validating: (values) => ({ status: 'validating', values }),
    invalid: (values, errors) => ({ status: 'invalid', values, errors }),
    submitting: (values) => ({ status: 'submitting', values }),
    submitted: (values) => ({ status: 'submitted', values }),
    error: (values, error) => ({ status: 'error', values, error }),
    
    canSubmit: (state) => state.status === 'dirty' || state.status === 'pristine',
    isSubmitting: (state) => state.status === 'submitting',
    hasErrors: (state) => state.status === 'invalid',
  }
}

interface FormStateHelpers<T extends Record<string, unknown>> {
  pristine(): { status: 'pristine'; values: T }
  dirty(values: T, touched: Set<keyof T>): { status: 'dirty'; values: T; touched: Set<keyof T> }
  validating(values: T): { status: 'validating'; values: T }
  invalid(values: T, errors: Partial<Record<keyof T, string>>): { status: 'invalid'; values: T; errors: Partial<Record<keyof T, string>> }
  submitting(values: T): { status: 'submitting'; values: T }
  submitted(values: T): { status: 'submitted'; values: T }
  error(values: T, error: Error): { status: 'error'; values: T; error: Error }
  
  canSubmit(state: FormState<T>): boolean
  isSubmitting(state: FormState<T>): boolean
  hasErrors(state: FormState<T>): boolean
}

// =============================================================================
// PAGINATION STATE
// =============================================================================

/**
 * Type-safe pagination state.
 * 
 * @example
 * type UserList = PaginatedData<User>
 */
export type PaginatedData<T> = {
  items: T[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Async paginated data combining AsyncData with pagination.
 */
export type AsyncPaginatedData<T, E = Error> = AsyncData<PaginatedData<T>, E>

// =============================================================================
// RESOURCE STATE (CRUD)
// =============================================================================

/**
 * Type-safe CRUD resource state.
 * 
 * @example
 * type UserResource = ResourceState<User>
 */
export type ResourceState<T, E = Error> = {
  data: T | null
  status: 'idle' | 'loading' | 'updating' | 'deleting' | 'error'
  error: E | null
  lastUpdated: Date | null
}

/**
 * Collection resource state for lists.
 */
export type CollectionState<T, E = Error> = {
  items: Map<string | number, T>
  status: 'idle' | 'loading' | 'error'
  error: E | null
  selectedIds: Set<string | number>
}

// =============================================================================
// MODAL/DIALOG STATE
// =============================================================================

/**
 * Type-safe modal state.
 * 
 * @example
 * type ConfirmModal = ModalState<{ title: string; message: string }>
 */
export type ModalState<T = void> =
  | { isOpen: false }
  | { isOpen: true; data: T }

/**
 * Create modal state helpers.
 */
export function modalState<T = void>(): ModalStateHelpers<T> {
  return {
    closed: () => ({ isOpen: false }),
    open: (data) => ({ isOpen: true, data }) as { isOpen: true; data: T },
    isOpen: (state): state is { isOpen: true; data: T } => state.isOpen,
  }
}

interface ModalStateHelpers<T> {
  closed(): { isOpen: false }
  open(data: T): { isOpen: true; data: T }
  isOpen(state: ModalState<T>): state is { isOpen: true; data: T }
}

// =============================================================================
// SELECTION STATE
// =============================================================================

/**
 * Type-safe selection state for lists.
 */
export type SelectionState<T extends string | number> =
  | { mode: 'none' }
  | { mode: 'single'; selected: T }
  | { mode: 'multiple'; selected: Set<T> }
  | { mode: 'all'; excluded: Set<T> }

// =============================================================================
// WIZARD/STEPPER STATE
// =============================================================================

/**
 * Type-safe wizard/stepper state.
 * 
 * @example
 * type CheckoutWizard = WizardState<{
 *   cart: { items: CartItem[] }
 *   shipping: { address: Address }
 *   payment: { method: PaymentMethod }
 *   confirmation: { orderId: string }
 * }>
 */
export type WizardState<Steps extends Record<string, unknown>> = {
  [K in keyof Steps]: {
    currentStep: K
    completedSteps: Exclude<keyof Steps, K>[]
    data: Partial<Steps>
  }
}[keyof Steps]

// =============================================================================
// NOTIFICATION STATE
// =============================================================================

/**
 * Type-safe notification/toast state.
 */
export type NotificationState<T extends string = 'info' | 'success' | 'warning' | 'error'> = {
  id: string
  type: T
  message: string
  title?: string
  duration?: number
  dismissible?: boolean
}

// =============================================================================
// FILTER STATE
// =============================================================================

/**
 * Type-safe filter state for search/filter UIs.
 * 
 * @example
 * type UserFilters = FilterState<{
 *   search: string
 *   role: 'admin' | 'user' | 'guest'
 *   active: boolean
 * }>
 */
export type FilterState<T extends Record<string, unknown>> = {
  filters: Partial<T>
  activeFilters: (keyof T)[]
  isFiltering: boolean
}

// =============================================================================
// UNDO/REDO STATE
// =============================================================================

/**
 * Type-safe undo/redo state.
 */
export type UndoableState<T> = {
  current: T
  past: T[]
  future: T[]
  canUndo: boolean
  canRedo: boolean
}

/**
 * Create undoable state helpers.
 */
export function undoable<T>(initial: T): UndoableStateHelpers<T> {
  return {
    init: () => ({
      current: initial,
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
    }),
    
    push: (state, value) => ({
      current: value,
      past: [...state.past, state.current],
      future: [],
      canUndo: true,
      canRedo: false,
    }),
    
    undo: (state) => {
      if (state.past.length === 0) return state
      const previous = state.past[state.past.length - 1]!
      return {
        current: previous,
        past: state.past.slice(0, -1),
        future: [state.current, ...state.future],
        canUndo: state.past.length > 1,
        canRedo: true,
      }
    },
    
    redo: (state) => {
      if (state.future.length === 0) return state
      const next = state.future[0]!
      return {
        current: next,
        past: [...state.past, state.current],
        future: state.future.slice(1),
        canUndo: true,
        canRedo: state.future.length > 1,
      }
    },
  }
}

interface UndoableStateHelpers<T> {
  init(): UndoableState<T>
  push(state: UndoableState<T>, value: T): UndoableState<T>
  undo(state: UndoableState<T>): UndoableState<T>
  redo(state: UndoableState<T>): UndoableState<T>
}

// =============================================================================
// BUILDER TYPE (Fluent Type Construction)
// =============================================================================

/**
 * Fluent type builder for constructing complex types.
 * 
 * @example
 * // Instead of: type Admin = User & { permissions: string[] } & Omit<Account, 'id'>
 * 
 * type Admin = Build<User>
 *   ['extend']<{ permissions: string[] }>
 *   ['omit']<'password'>
 *   ['done']
 */
export type Build<T> = {
  extend: <U extends object>() => Build<Prettify<T & U>>
  pick: <K extends keyof T>() => Build<Pick<T, K>>
  omit: <K extends keyof T>() => Build<Omit<T, K>>
  partial: () => Build<Partial<T>>
  required: () => Build<Required<T>>
  readonly: () => Build<Readonly<T>>
  nullable: () => Build<T | null>
  optional: () => Build<T | undefined>
  array: () => Build<T[]>
  promise: () => Build<Promise<T>>
  done: T
}

/**
 * Start building a type from a base type.
 * This is a type-level utility, no runtime code needed.
 * 
 * @example
 * interface User { id: number; name: string; password: string }
 * 
 * // Create a public user type
 * type PublicUser = Build<User>['omit']<'password'>['done']
 * // { id: number; name: string }
 * 
 * // Create an admin type
 * type Admin = Build<User>['extend']<{ role: 'admin'; permissions: string[] }>['done']
 * // { id: number; name: string; password: string; role: 'admin'; permissions: string[] }
 */
export type TypeBuilder<T> = Build<T>
