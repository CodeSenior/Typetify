/**
 * Zero-Effort Types - TypeScript devient AMUSANT
 * 
 * Plus de `type User = Infer<typeof UserSchema>` !
 * Définissez une fois, utilisez le type avec `.T`
 */

import { v, collection, collectionWithId, asyncData, matchUnion } from '../src/typed'

// ============================================================================
// LE PROBLÈME: Double travail
// ============================================================================

// ❌ AVANT: On définit le schéma ET on doit extraire le type manuellement
// const UserSchema = object({ id: number(), name: string() })
// type User = Infer<typeof UserSchema>  // <-- CASSE-COUILLE!

// ============================================================================
// LA SOLUTION: Type Fantôme avec .T
// ============================================================================

// ✅ APRÈS: Une seule définition, le type vient avec!
const User = v.object({
  id: v.number(),
  name: v.string(),
  email: v.email(),
  role: v.enum('admin', 'user', 'guest'),
  createdAt: v.date(),
})

// Utiliser le type directement avec .T - ZÉRO effort!
function saveUser(user: typeof User.T) {
  console.log(`Saving ${user.name} (${user.email})`)
  // Autocomplétion parfaite sur user.id, user.name, user.email, user.role, user.createdAt
}

// Parser des données d'API
const apiData = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', createdAt: '2024-01-01' }
const user = User.parse(apiData)
// user est typé comme { id: number; name: string; email: string; role: 'admin' | 'user' | 'guest'; createdAt: Date }

saveUser(user)

// ============================================================================
// MANIPULATION FLUIDE DES SCHÉMAS
// ============================================================================

// Créer des variantes sans répétition
const PublicUser = User.pick('id', 'name', 'role')
// typeof PublicUser.T = { id: number; name: string; role: 'admin' | 'user' | 'guest' }

const UserWithoutEmail = User.omit('email')
// typeof UserWithoutEmail.T = { id: number; name: string; role: ...; createdAt: Date }

const PartialUser = User.partial()
// typeof PartialUser.T = { id?: number; name?: string; email?: string; ... }

// Extension de schéma
const AdminUser = User.extend({
  permissions: v.array(v.string()),
  department: v.string(),
})
// typeof AdminUser.T inclut permissions et department

// Fusion de schémas
const Timestamps = v.object({
  createdAt: v.date(),
  updatedAt: v.date(),
})

const Article = v.object({
  id: v.number(),
  title: v.string(),
  content: v.string(),
}).merge(Timestamps)

// ============================================================================
// COLLECTIONS TYPÉES AUTOMATIQUEMENT
// ============================================================================

// Créer une collection à partir d'un schéma - UNE ligne!
const Users = collection(User)

// Tout est typé automatiquement!
Users.add({ id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', createdAt: new Date() })
Users.add({ id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', createdAt: new Date() })
Users.add({ id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'guest', createdAt: new Date() })

// Recherche avec autocomplétion sur les clés
const admin = Users.find('role', 'admin')
console.log('Admin:', admin?.name) // Alice

// Filtrage type-safe
const nonGuests = Users.where(u => u.role !== 'guest')
console.log('Non-guests:', nonGuests.map(u => u.name)) // ['Alice', 'Bob']

// Extraction de propriétés
const names = Users.pluck('name')
console.log('Names:', names) // ['Alice', 'Bob', 'Charlie']

// Pick sur tous les items
const publicUsers = Users.pick('id', 'name')
console.log('Public users:', publicUsers) // [{ id: 1, name: 'Alice' }, ...]

// Groupement
const byRole = Users.groupBy('role')
console.log('Admins:', byRole.get('admin')?.length) // 1

// Tri
const sorted = Users.sortBy('name', 'asc')
console.log('Sorted:', sorted.map(u => u.name)) // ['Alice', 'Bob', 'Charlie']

// ============================================================================
// COLLECTION AVEC ID
// ============================================================================

const UsersById = collectionWithId(User, 'id')

UsersById.add({ id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', createdAt: new Date() })
UsersById.add({ id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', createdAt: new Date() })

// Opérations par ID
const alice = UsersById.byId(1)
console.log('Found by ID:', alice?.name) // Alice

UsersById.updateById(1, { name: 'Alice Smith' })
console.log('Updated:', UsersById.byId(1)?.name) // Alice Smith

UsersById.removeById(2)
console.log('Remaining:', UsersById.length) // 1

// ============================================================================
// INTÉGRATION AVEC ASYNC DATA
// ============================================================================

// État async pour la collection
type UserType = typeof User.T
const usersState = asyncData<UserType[]>()

// Simuler le chargement
const loadingState = usersState.loading()
console.log('Status:', loadingState.status) // 'loading'

// Simuler le succès
const successState = usersState.success(Users.toArray())
if (usersState.isSuccess(successState)) {
  console.log('Loaded users:', successState.data.length)
}

// Pattern matching avec type guards
function renderUsersState(s: { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: UserType[] } | { status: 'error'; error: Error }): string {
  if (s.status === 'idle') return 'Cliquez pour charger'
  if (s.status === 'loading') return 'Chargement...'
  if (s.status === 'success') return `${s.data.length} utilisateurs chargés`
  if (s.status === 'error') return `Erreur: ${s.error.message}`
  return 'État inconnu'
}

console.log(renderUsersState(successState))

// ============================================================================
// VALIDATION SAFE
// ============================================================================

// safeParse retourne un Result au lieu de throw
const result = User.safeParse({ id: 'not a number', name: 123 })

if (result.ok) {
  console.log('Valid user:', result.value.name)
} else {
  console.log('Validation error:', result.error.message)
}

// Type guard
const maybeUser: unknown = { id: 1, name: 'Test', email: 'test@test.com', role: 'user', createdAt: new Date() }

if (User.is(maybeUser)) {
  // maybeUser est maintenant typé comme typeof User.T
  console.log('Valid user:', maybeUser.name)
}

// ============================================================================
// RÉSUMÉ: ZÉRO EFFORT, MAXIMUM SÉCURITÉ
// ============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║              TYPETIFY - ZÉRO EFFORT, MAXIMUM SÉCURITÉ            ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  DÉFINITION (1 ligne = type + validation)                        ║
║  const User = v.object({                                         ║
║    id: v.number(),                                               ║
║    name: v.string(),                                             ║
║    email: v.email(),                                             ║
║  })                                                              ║
║                                                                  ║
║  UTILISATION DU TYPE                                             ║
║  function save(user: typeof User.T) { ... }                      ║
║  // Pas de Infer<typeof ...> !                                   ║
║                                                                  ║
║  MANIPULATION                                                    ║
║  User.pick('id', 'name')     → Nouveau schéma                    ║
║  User.omit('password')       → Sans certains champs              ║
║  User.partial()              → Tous optionnels                   ║
║  User.extend({ ... })        → Ajouter des champs                ║
║                                                                  ║
║  COLLECTION (1 ligne = CRUD complet)                             ║
║  const Users = collection(User)                                  ║
║  Users.add({ ... })          → Typé!                             ║
║  Users.find('name', 'Alice') → Autocomplétion!                   ║
║  Users.pluck('name')         → string[]                          ║
║  Users.groupBy('role')       → Map typée                         ║
║                                                                  ║
║  VALIDATION                                                      ║
║  User.parse(data)            → Typé ou throw                     ║
║  User.safeParse(data)        → Result<T, Error>                  ║
║  User.is(data)               → Type guard                        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`)

// ============================================================================
// EXEMPLE COMPLET: API REST
// ============================================================================

// Définir les modèles
const Post = v.object({
  id: v.number(),
  title: v.string(),
  body: v.string(),
  authorId: v.number(),
  published: v.boolean(),
  tags: v.array(v.string()),
})

const Comment = v.object({
  id: v.number(),
  postId: v.number(),
  authorId: v.number(),
  content: v.string(),
  createdAt: v.date(),
})

// Créer les collections
const Posts = collectionWithId(Post, 'id')
const Comments = collectionWithId(Comment, 'id')

// Ajouter des données
Posts.add({ id: 1, title: 'Hello World', body: 'My first post', authorId: 1, published: true, tags: ['intro'] })
Posts.add({ id: 2, title: 'TypeScript Tips', body: 'Advanced TS', authorId: 1, published: false, tags: ['typescript', 'tips'] })

Comments.add({ id: 1, postId: 1, authorId: 2, content: 'Great post!', createdAt: new Date() })
Comments.add({ id: 2, postId: 1, authorId: 3, content: 'Thanks for sharing', createdAt: new Date() })

// Requêtes type-safe
const publishedPosts = Posts.where(p => p.published)
const postComments = Comments.whereEquals('postId', 1)

console.log('\n📝 Published posts:', publishedPosts.map(p => p.title))
console.log('💬 Comments on post 1:', postComments.length)

// Fonction API type-safe
async function getPostWithComments(postId: number): Promise<{
  post: typeof Post.T
  comments: typeof Comment.T[]
} | null> {
  const post = Posts.byId(postId)
  if (!post) return null
  
  const comments = Comments.whereEquals('postId', postId)
  return { post, comments }
}

// Utilisation
getPostWithComments(1).then(result => {
  if (result) {
    console.log(`\n📄 ${result.post.title}`)
    console.log(`   ${result.comments.length} comments`)
  }
})
