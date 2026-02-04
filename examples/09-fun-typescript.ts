/**
 * TypeScript Amusant - L'approche "Lego"
 * 
 * Ce fichier démontre comment Typetify transforme TypeScript
 * d'une corvée de "rédaction de dictionnaire" en une expérience
 * de construction intuitive et amusante.
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
// PROBLÈME 1: Déclaration de types complexes
// ============================================================================

// ❌ AVANT: Syntaxe verbeuse et intimidante
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

// ✅ APRÈS: Construction "Lego" avec defineModel
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

// Le type est extrait automatiquement!
type User = InferModel<typeof User>

// ============================================================================
// PROBLÈME 2: Syntaxe encore plus simple avec model()
// ============================================================================

// ✅ Utiliser les constructeurs natifs pour les cas simples
const Product = model({
  id: Number,
  name: String,
  price: Number,
  inStock: Boolean,
  category: ['electronics', 'clothing', 'food'] as const,
})

type Product = InferModel<typeof Product>

// ============================================================================
// PROBLÈME 3: Composition de modèles
// ============================================================================

// Modèles réutilisables
const Timestamps = defineModel({
  createdAt: t.date,
  updatedAt: t.date,
})

const SoftDelete = defineModel({
  deletedAt: t.optional(t.date),
  isDeleted: t.boolean,
})

// Composition par fusion
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
// PROBLÈME 4: Manipulation fluide des modèles
// ============================================================================

// Créer des variantes sans répétition
const PublicUser = User.omit('email', 'settings')
type PublicUser = InferModel<typeof PublicUser>
// { id: number; name: string; role: 'admin' | 'user' | 'guest'; tags: string[]; createdAt: Date }

const UserCredentials = User.pick('email')
type UserCredentials = InferModel<typeof UserCredentials>
// { email: string }

const PartialUser = User.asPartial()
type PartialUser = InferModel<typeof PartialUser>
// Tous les champs sont optionnels

// Extension de modèle
const AdminUser = User.extend({
  permissions: t.array(t.string),
  department: t.string,
})
type AdminUser = InferModel<typeof AdminUser>

// ============================================================================
// PROBLÈME 5: États asynchrones (fini les isLoading: boolean!)
// ============================================================================

// ❌ AVANT: États impossibles possibles
interface BadUserState {
  isLoading: boolean
  isError: boolean
  data?: User
  error?: Error
}
// Permet: { isLoading: true, data: user } - État impossible!

// ✅ APRÈS: AsyncData garantit des états valides
type UserState = AsyncData<User>

// Helpers pour créer les états
const userState = asyncData<User>()

// Création d'états type-safe
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

// Pattern matching exhaustif
function renderUserState(state: UserState): string {
  return matchUnion(state, 'status', {
    idle: () => '🔵 Prêt à charger',
    loading: () => '⏳ Chargement...',
    success: (s) => `✅ Bienvenue ${s.data.name}!`,
    error: (s) => `❌ Erreur: ${s.error.message}`,
  })
}

console.log(renderUserState(idle))      // 🔵 Prêt à charger
console.log(renderUserState(loading))   // ⏳ Chargement...
console.log(renderUserState(success))   // ✅ Bienvenue Alice!
console.log(renderUserState(error))     // ❌ Erreur: Network error

// ============================================================================
// PROBLÈME 6: États de formulaire
// ============================================================================

// Définir le formulaire
const LoginForm = defineModel({
  email: t.string,
  password: t.string,
  rememberMe: t.boolean,
})
type LoginFormValues = InferModel<typeof LoginForm>

// État du formulaire type-safe
type LoginFormState = FormState<LoginFormValues>

const form = formState<LoginFormValues>({
  email: '',
  password: '',
  rememberMe: false,
})

// Transitions d'état
let state: LoginFormState = form.pristine()
console.log('Form status:', state.status) // 'pristine'

// Simuler une saisie
state = form.dirty(
  { email: 'alice@example.com', password: '', rememberMe: true },
  new Set(['email', 'rememberMe'])
)

// Vérifier si on peut soumettre
console.log('Can submit:', form.canSubmit(state)) // true

// ============================================================================
// PROBLÈME 7: États de modal/dialog
// ============================================================================

// Modal avec données typées
type ConfirmDeleteModal = ModalState<{ userId: number; userName: string }>

const modal = modalState<{ userId: number; userName: string }>()

let modalState1: ConfirmDeleteModal = modal.closed()
console.log('Modal open:', modalState1.isOpen) // false

modalState1 = modal.open({ userId: 1, userName: 'Alice' })
if (modal.isOpen(modalState1)) {
  console.log(`Confirmer suppression de ${modalState1.data.userName}?`)
}

// ============================================================================
// PROBLÈME 8: Undo/Redo
// ============================================================================

interface EditorContent {
  text: string
  cursorPosition: number
}

const editor = undoable<EditorContent>({ text: '', cursorPosition: 0 })

let editorState = editor.init()
console.log('Can undo:', editorState.canUndo) // false

// Faire des modifications
editorState = editor.push(editorState, { text: 'Hello', cursorPosition: 5 })
editorState = editor.push(editorState, { text: 'Hello World', cursorPosition: 11 })
console.log('Can undo:', editorState.canUndo) // true

// Annuler
editorState = editor.undo(editorState)
console.log('Current text:', editorState.current.text) // 'Hello'
console.log('Can redo:', editorState.canRedo) // true

// Refaire
editorState = editor.redo(editorState)
console.log('Current text:', editorState.current.text) // 'Hello World'

// ============================================================================
// PROBLÈME 9: Type Builder (Construction de types au niveau type)
// ============================================================================

// Le type Build permet de construire des types de manière fluide
// C'est purement au niveau des types, pas de runtime

interface BaseUser {
  id: number
  name: string
  email: string
  password: string
}

// Construire des variantes de types avec Omit/Pick/Partial standards
// (Build est un type utilitaire pour documentation, utilisons les types natifs)
type SafeUser = Omit<BaseUser, 'password'>
// { id: number; name: string; email: string }

type UserWithRole = BaseUser & { role: 'admin' | 'user' }
// { id: number; name: string; email: string; password: string; role: 'admin' | 'user' }

type OptionalUser = Partial<BaseUser>
// { id?: number; name?: string; email?: string; password?: string }

type UserArray = Omit<BaseUser, 'password'>[]
// { id: number; name: string; email: string }[]

// ============================================================================
// RÉSUMÉ: TypeScript devient amusant!
// ============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║              TYPETIFY - TYPESCRIPT DEVIENT AMUSANT               ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  DÉFINITION DE MODÈLES (Style Lego)                              ║
║  ├─ defineModel({ ... })    → Définition avec t.string, etc.     ║
║  ├─ model({ ... })          → Syntaxe simplifiée avec Number     ║
║  ├─ mergeModels(A, B)       → Composition de modèles             ║
║  ├─ User.extend({ ... })    → Extension fluide                   ║
║  ├─ User.pick('a', 'b')     → Sélection de champs                ║
║  └─ User.omit('password')   → Exclusion de champs                ║
║                                                                  ║
║  MÉTA-TYPES (Templates prêts à l'emploi)                         ║
║  ├─ AsyncData<T>            → États async (idle/loading/...)     ║
║  ├─ FormState<T>            → États de formulaire                ║
║  ├─ ModalState<T>           → États de modal                     ║
║  ├─ PaginatedData<T>        → Données paginées                   ║
║  ├─ UndoableState<T>        → Undo/Redo                          ║
║  └─ SelectionState<T>       → Sélection dans une liste           ║
║                                                                  ║
║  TYPE BUILDER (Construction fluide)                              ║
║  └─ Build<User>['omit']<'password'>['extend']<{...}>['done']     ║
║                                                                  ║
║  HELPERS                                                         ║
║  ├─ asyncData<T>()          → Créer des états async              ║
║  ├─ formState<T>(init)      → Créer des états de formulaire      ║
║  ├─ modalState<T>()         → Créer des états de modal           ║
║  └─ undoable<T>(init)       → Créer des états undo/redo          ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`)

// ============================================================================
// EXEMPLE COMPLET: Application Todo
// ============================================================================

// 1. Définir les modèles
const Todo = defineModel({
  id: t.number,
  title: t.string,
  completed: t.boolean,
  priority: t.enum('low', 'medium', 'high'),
  dueDate: t.optional(t.date),
})

type Todo = InferModel<typeof Todo>

// 2. Définir l'état de l'application
type TodoListState = AsyncData<Todo[]>
type AddTodoModal = ModalState<Partial<Todo>>
type TodoFilters = {
  search: string
  priority: 'all' | 'low' | 'medium' | 'high'
  showCompleted: boolean
}

// 3. Créer les helpers
const todoListState = asyncData<Todo[]>()
const addTodoModal = modalState<Partial<Todo>>()

// 4. État initial
const initialState = {
  todos: todoListState.idle(),
  addModal: addTodoModal.closed(),
  filters: {
    search: '',
    priority: 'all' as const,
    showCompleted: true,
  },
}

// 5. Simuler le chargement
const loadedState = {
  ...initialState,
  todos: todoListState.success([
    { id: 1, title: 'Apprendre Typetify', completed: false, priority: 'high' as const },
    { id: 2, title: 'Créer une app', completed: false, priority: 'medium' as const },
    { id: 3, title: 'Déployer', completed: true, priority: 'low' as const },
  ]),
}

// 6. Rendu type-safe
function renderTodoList(state: typeof loadedState): string {
  return matchUnion(state.todos, 'status', {
    idle: () => 'Cliquez pour charger les todos',
    loading: () => 'Chargement des todos...',
    success: (s: { status: 'success'; data: Todo[] }) => {
      const filtered = s.data.filter(todo => 
        state.filters.showCompleted || !todo.completed
      )
      return filtered.map(item => 
        `${item.completed ? '✅' : '⬜'} [${item.priority}] ${item.title}`
      ).join('\n')
    },
    error: (s: { status: 'error'; error: Error }) => `Erreur: ${s.error.message}`,
  })
}

console.log('\n📋 Todo List:\n' + renderTodoList(loadedState))
