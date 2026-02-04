/**
 * Fun TypeScript - the "Lego" approach
 * 
 * This file demonstrates how Typetify transforms TypeScript
 * from a "dictionary-writing" chore into an intuitive,
 * fun building experience.
 */

import {
  // Model definition
  defineModel,
  model,
  mergeModels,
  t,
  type InferModel,
  
  // Meta-types
  asyncData,
  formState,
  modalState,
  undoable,
  type AsyncData,
  type FormState,
  type ModalState,
  type Build,
  
  // Pattern matching
  matchUnion,
  
  // Type utilities
  type Prettify,
  type VariantUnion,
} from '../src/typed'

// ============================================================================
// PROBLEM 1: Declaring complex types
// ============================================================================

// ❌ BEFORE: Verbose, intimidating syntax
interface OldUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'user' | 'guest'
  settings: {
    theme: 'light' | 'dark'
    notifications: boolean
  }
  tags: string[]
  createdAt: Date
}

// ✅ AFTER: "Lego" construction with defineModel
const User = defineModel({
  id: t.number,
  name: t.string,
  email: t.string,
  role: t.enum('admin', 'user', 'guest'),
  settings: {
    theme: t.enum('light', 'dark'),
    notifications: t.boolean,
  },
  tags: t.array(t.string),
  createdAt: t.date,
})

// The type is extracted automatically!
type User = InferModel<typeof User>

// ============================================================================
// PROBLEM 2: Even simpler syntax with model()
// ============================================================================

// ✅ Use native constructors for simple cases
const Product = model({
  id: Number,
  name: String,
  price: Number,
  inStock: Boolean,
  category: ['electronics', 'clothing', 'food'] as const,
})

type Product = InferModel<typeof Product>

// ============================================================================
// PROBLEM 3: Model composition
// ============================================================================

// Reusable models
const Timestamps = defineModel({
  createdAt: t.date,
  updatedAt: t.date,
})

const SoftDelete = defineModel({
  deletedAt: t.optional(t.date),
  isDeleted: t.boolean,
})

// Composition via merge
const Article = mergeModels(
  defineModel({
    id: t.number,
    title: t.string,
    content: t.string,
    authorId: t.number,
  }),
  Timestamps
)

type Article = InferModel<typeof Article>
// { id: number; title: string; content: string; authorId: number; createdAt: Date; updatedAt: Date }

// ============================================================================
// PROBLEM 4: Fluent model manipulation
// ============================================================================

// Create variants without repetition
const PublicUser = User.omit('email', 'settings')
type PublicUser = InferModel<typeof PublicUser>
// { id: number; name: string; role: 'admin' | 'user' | 'guest'; tags: string[]; createdAt: Date }

const UserCredentials = User.pick('email')
type UserCredentials = InferModel<typeof UserCredentials>
// { email: string }

const PartialUser = User.asPartial()
type PartialUser = InferModel<typeof PartialUser>
// All fields are optional

// Model extension
const AdminUser = User.extend({
  permissions: t.array(t.string),
  department: t.string,
})
type AdminUser = InferModel<typeof AdminUser>

// ============================================================================
// PROBLEM 5: Async states (no more isLoading: boolean!)
// ============================================================================

// ❌ BEFORE: Impossible states are possible
interface BadUserState {
  isLoading: boolean
  isError: boolean
  data?: User
  error?: Error
}
// Allows: { isLoading: true, data: user } - impossible state!

// ✅ AFTER: AsyncData guarantees valid states
type UserState = AsyncData<User>

// Helpers to create states
const userState = asyncData<User>()

// Creating type-safe states
const idle = userState.idle()
const loading = userState.loading()
const success = userState.success({ 
  id: 1, 
  name: 'Alice',
  email: 'alice@example.com',
  role: 'admin',
  settings: { theme: 'dark', notifications: true },
  tags: ['vip'],
  createdAt: new Date(),
})
const error = userState.error(new Error('Network error'))

// Exhaustive pattern matching
function renderUserState(state: UserState): string {
  return matchUnion(state, 'status', {
    idle: () => '🔵 Ready to load',
    loading: () => '⏳ Loading...',
    success: (s) => `✅ Welcome ${s.data.name}!`,
    error: (s) => `❌ Error: ${s.error.message}`,
  })
}

console.log(renderUserState(idle))      // 🔵 Ready to load
console.log(renderUserState(loading))   // ⏳ Loading...
console.log(renderUserState(success))   // ✅ Welcome Alice!
console.log(renderUserState(error))     // ❌ Error: Network error

// ============================================================================
// PROBLEM 6: Form state
// ============================================================================

// Define the form
const LoginForm = defineModel({
  email: t.string,
  password: t.string,
  rememberMe: t.boolean,
})
type LoginFormValues = InferModel<typeof LoginForm>

// Type-safe form state
type LoginFormState = FormState<LoginFormValues>

const form = formState<LoginFormValues>({
  email: '',
  password: '',
  rememberMe: false,
})

// State transitions
let state: LoginFormState = form.pristine()
console.log('Form status:', state.status) // 'pristine'

// Simulate user input
state = form.dirty(
  { email: 'alice@example.com', password: '', rememberMe: true },
  new Set(['email', 'rememberMe'])
)

// Check if we can submit
console.log('Can submit:', form.canSubmit(state)) // true

// ============================================================================
// PROBLEM 7: Modal/dialog state
// ============================================================================

// Modal with typed data
type ConfirmDeleteModal = ModalState<{ userId: number; userName: string }>

const modal = modalState<{ userId: number; userName: string }>()

let modalState1: ConfirmDeleteModal = modal.closed()
console.log('Modal open:', modalState1.isOpen) // false

modalState1 = modal.open({ userId: 1, userName: 'Alice' })
if (modal.isOpen(modalState1)) {
  console.log(`Confirm deletion of ${modalState1.data.userName}?`)
}

// ============================================================================
// PROBLEM 8: Undo/Redo
// ============================================================================

interface EditorContent {
  text: string
  cursorPosition: number
}

const editor = undoable<EditorContent>({ text: '', cursorPosition: 0 })

let editorState = editor.init()
console.log('Can undo:', editorState.canUndo) // false

// Make changes
editorState = editor.push(editorState, { text: 'Hello', cursorPosition: 5 })
editorState = editor.push(editorState, { text: 'Hello World', cursorPosition: 11 })
console.log('Can undo:', editorState.canUndo) // true

// Undo
editorState = editor.undo(editorState)
console.log('Current text:', editorState.current.text) // 'Hello'
console.log('Can redo:', editorState.canRedo) // true

// Redo
editorState = editor.redo(editorState)
console.log('Current text:', editorState.current.text) // 'Hello World'

// ============================================================================
// PROBLEM 9: Type Builder (type-level type construction)
// ============================================================================

// The Build type allows fluent type construction
// It's purely type-level, not runtime

interface BaseUser {
  id: number
  name: string
  email: string
  password: string
}

// Build type variants using standard Omit/Pick/Partial
// (Build is a utility type for docs; we use native types here)
type SafeUser = Omit<BaseUser, 'password'>
// { id: number; name: string; email: string }

type UserWithRole = BaseUser & { role: 'admin' | 'user' }
// { id: number; name: string; email: string; password: string; role: 'admin' | 'user' }

type OptionalUser = Partial<BaseUser>
// { id?: number; name?: string; email?: string; password?: string }

type UserArray = Omit<BaseUser, 'password'>[]
// { id: number; name: string; email: string }[]

// ============================================================================
// SUMMARY: TypeScript becomes fun!
// ============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║              TYPETIFY - TYPESCRIPT BECOMES FUN                   ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  MODEL DEFINITION (Lego style)                                   ║
║  ├─ defineModel({ ... })    → Definition with t.string, etc.     ║
║  ├─ model({ ... })          → Simplified syntax with Number      ║
║  ├─ mergeModels(A, B)       → Model composition                  ║
║  ├─ User.extend({ ... })    → Fluent extension                   ║
║  ├─ User.pick('a', 'b')     → Field selection                    ║
║  └─ User.omit('password')   → Field exclusion                    ║
║                                                                  ║
║  META-TYPES (ready-to-use templates)                             ║
║  ├─ AsyncData<T>            → Async states (idle/loading/...)    ║
║  ├─ FormState<T>            → Form states                        ║
║  ├─ ModalState<T>           → Modal states                       ║
║  ├─ PaginatedData<T>        → Paginated data                     ║
║  ├─ UndoableState<T>        → Undo/Redo                          ║
║  └─ SelectionState<T>       → List selection                     ║
║                                                                  ║
║  TYPE BUILDER (fluent construction)                              ║
║  └─ Build<User>['omit']<'password'>['extend']<{...}>['done']     ║
║                                                                  ║
║  HELPERS                                                         ║
║  ├─ asyncData<T>()          → Create async states                ║
║  ├─ formState<T>(init)      → Create form states                 ║
║  ├─ modalState<T>()         → Create modal states                ║
║  └─ undoable<T>(init)       → Create undo/redo state             ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`)

// ============================================================================
// COMPLETE EXAMPLE: Todo app
// ============================================================================

// 1. Define models
const Todo = defineModel({
  id: t.number,
  title: t.string,
  completed: t.boolean,
  priority: t.enum('low', 'medium', 'high'),
  dueDate: t.optional(t.date),
})

type Todo = InferModel<typeof Todo>

// 2. Define the app state
type TodoListState = AsyncData<Todo[]>
type AddTodoModal = ModalState<Partial<Todo>>
type TodoFilters = {
  search: string
  priority: 'all' | 'low' | 'medium' | 'high'
  showCompleted: boolean
}

// 3. Create helpers
const todoListState = asyncData<Todo[]>()
const addTodoModal = modalState<Partial<Todo>>()

// 4. Initial state
const initialState = {
  todos: todoListState.idle(),
  addModal: addTodoModal.closed(),
  filters: {
    search: '',
    priority: 'all' as const,
    showCompleted: true,
  },
}

// 5. Simulate loading
const loadedState = {
  ...initialState,
  todos: todoListState.success([
    { id: 1, title: 'Learn Typetify', completed: false, priority: 'high' as const },
    { id: 2, title: 'Build an app', completed: false, priority: 'medium' as const },
    { id: 3, title: 'Deploy', completed: true, priority: 'low' as const },
  ]),
}

// 6. Type-safe rendering
function renderTodoList(state: typeof loadedState): string {
  return matchUnion(state.todos, 'status', {
    idle: () => 'Click to load todos',
    loading: () => 'Loading todos...',
    success: (s: { status: 'success'; data: Todo[] }) => {
      const filtered = s.data.filter(todo => 
        state.filters.showCompleted || !todo.completed
      )
      return filtered.map(item => 
        `${item.completed ? '✅' : '⬜'} [${item.priority}] ${item.title}`
      ).join('\n')
    },
    error: (s: { status: 'error'; error: Error }) => `Error: ${s.error.message}`,
  })
}

console.log('\n📋 Todo List:\n' + renderTodoList(loadedState))
