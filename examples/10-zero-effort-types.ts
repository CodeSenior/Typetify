/**
 * Zero-Effort Types - TypeScript becomes FUN
 * 
 * No more `type User = Infer<typeof UserSchema>`!
 * Define once, use the type via `.T`
 */

import { v, collection, collectionWithId, asyncData, matchUnion } from '../src/typed'

// ============================================================================
// THE PROBLEM: Duplicate work
// ============================================================================

// ❌ BEFORE: Define the schema AND manually extract the type
// const UserSchema = object({ id: number(), name: string() })
// type User = Infer<typeof UserSchema>  // <-- Annoying!

// ============================================================================
// THE SOLUTION: Phantom type via .T
// ============================================================================

// ✅ AFTER: One definition, the type comes with it!
const User = v.object({
  id: v.number(),
  name: v.string(),
  email: v.email(),
  role: v.enum('admin', 'user', 'guest'),
  createdAt: v.date(),
})

// Use the type directly via .T - zero effort!
function saveUser(user: typeof User.T) {
  console.log(`Saving ${user.name} (${user.email})`)
  // Perfect autocomplete on user.id, user.name, user.email, user.role, user.createdAt
}

// Parse API data
const apiData = { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', createdAt: '2024-01-01' }
const user = User.parse(apiData)
// user is typed as { id: number; name: string; email: string; role: 'admin' | 'user' | 'guest'; createdAt: Date }

saveUser(user)

// ============================================================================
// FLUENT SCHEMA MANIPULATION
// ============================================================================

// Create variants without repetition
const PublicUser = User.pick('id', 'name', 'role')
// typeof PublicUser.T = { id: number; name: string; role: 'admin' | 'user' | 'guest' }

const UserWithoutEmail = User.omit('email')
// typeof UserWithoutEmail.T = { id: number; name: string; role: ...; createdAt: Date }

const PartialUser = User.partial()
// typeof PartialUser.T = { id?: number; name?: string; email?: string; ... }

// Schema extension
const AdminUser = User.extend({
  permissions: v.array(v.string()),
  department: v.string(),
})
// typeof AdminUser.T includes permissions and department

// Schema merge
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
// AUTOMATICALLY TYPED COLLECTIONS
// ============================================================================

// Create a collection from a schema - ONE line!
const Users = collection(User)

// Everything is typed automatically!
Users.add({ id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', createdAt: new Date() })
Users.add({ id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', createdAt: new Date() })
Users.add({ id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'guest', createdAt: new Date() })

// Find with autocomplete on keys
const admin = Users.find('role', 'admin')
console.log('Admin:', admin?.name) // Alice

// Type-safe filtering
const nonGuests = Users.where(u => u.role !== 'guest')
console.log('Non-guests:', nonGuests.map(u => u.name)) // ['Alice', 'Bob']

// Pluck properties
const names = Users.pluck('name')
console.log('Names:', names) // ['Alice', 'Bob', 'Charlie']

// Pick on all items
const publicUsers = Users.pick('id', 'name')
console.log('Public users:', publicUsers) // [{ id: 1, name: 'Alice' }, ...]

// Grouping
const byRole = Users.groupBy('role')
console.log('Admins:', byRole.get('admin')?.length) // 1

// Sorting
const sorted = Users.sortBy('name', 'asc')
console.log('Sorted:', sorted.map(u => u.name)) // ['Alice', 'Bob', 'Charlie']

// ============================================================================
// COLLECTION WITH ID
// ============================================================================

const UsersById = collectionWithId(User, 'id')

UsersById.add({ id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin', createdAt: new Date() })
UsersById.add({ id: 2, name: 'Bob', email: 'bob@example.com', role: 'user', createdAt: new Date() })

// Operations by ID
const alice = UsersById.byId(1)
console.log('Found by ID:', alice?.name) // Alice

UsersById.updateById(1, { name: 'Alice Smith' })
console.log('Updated:', UsersById.byId(1)?.name) // Alice Smith

UsersById.removeById(2)
console.log('Remaining:', UsersById.length) // 1

// ============================================================================
// ASYNC DATA INTEGRATION
// ============================================================================

// Async state for the collection
type UserType = typeof User.T
const usersState = asyncData<UserType[]>()

// Simulate loading
const loadingState = usersState.loading()
console.log('Status:', loadingState.status) // 'loading'

// Simulate success
const successState = usersState.success(Users.toArray())
if (usersState.isSuccess(successState)) {
  console.log('Loaded users:', successState.data.length)
}

// Pattern matching with type guards
function renderUsersState(s: { status: 'idle' } | { status: 'loading' } | { status: 'success'; data: UserType[] } | { status: 'error'; error: Error }): string {
  if (s.status === 'idle') return 'Click to load'
  if (s.status === 'loading') return 'Loading...'
  if (s.status === 'success') return `${s.data.length} users loaded`
  if (s.status === 'error') return `Error: ${s.error.message}`
  return 'Unknown state'
}

console.log(renderUsersState(successState))

// ============================================================================
// SAFE VALIDATION
// ============================================================================

// safeParse returns a Result instead of throwing
const result = User.safeParse({ id: 'not a number', name: 123 })

if (result.ok) {
  console.log('Valid user:', result.value.name)
} else {
  console.log('Validation error:', result.error.message)
}

// Type guard
const maybeUser: unknown = { id: 1, name: 'Test', email: 'test@test.com', role: 'user', createdAt: new Date() }

if (User.is(maybeUser)) {
  // maybeUser is now typed as typeof User.T
  console.log('Valid user:', maybeUser.name)
}

// ============================================================================
// SUMMARY: ZERO EFFORT, MAXIMUM SAFETY
// ============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║              TYPETIFY - ZERO EFFORT, MAXIMUM SAFETY              ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  DEFINITION (1 line = type + validation)                          ║
║  const User = v.object({                                         ║
║    id: v.number(),                                               ║
║    name: v.string(),                                             ║
║    email: v.email(),                                             ║
║  })                                                              ║
║                                                                  ║
║  TYPE USAGE                                                      ║
║  function save(user: typeof User.T) { ... }                      ║
║  // No Infer<typeof ...>!                                        ║
║                                                                  ║
║  MANIPULATION                                                    ║
║  User.pick('id', 'name')     → New schema                        ║
║  User.omit('password')       → Without some fields               ║
║  User.partial()              → All optional                      ║
║  User.extend({ ... })        → Add fields                        ║
║                                                                  ║
║  COLLECTION (1 line = full CRUD)                                 ║
║  const Users = collection(User)                                  ║
║  Users.add({ ... })          → Typed!                            ║
║  Users.find('name', 'Alice') → Autocomplete!                     ║
║  Users.pluck('name')         → string[]                          ║
║  Users.groupBy('role')       → Typed Map                         ║
║                                                                  ║
║  VALIDATION                                                      ║
║  User.parse(data)            → Typed or throws                   ║
║  User.safeParse(data)        → Result<T, Error>                  ║
║  User.is(data)               → Type guard                        ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`)

// ============================================================================
// COMPLETE EXAMPLE: REST API
// ============================================================================

// Define models
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

// Create collections
const Posts = collectionWithId(Post, 'id')
const Comments = collectionWithId(Comment, 'id')

// Add data
Posts.add({ id: 1, title: 'Hello World', body: 'My first post', authorId: 1, published: true, tags: ['intro'] })
Posts.add({ id: 2, title: 'TypeScript Tips', body: 'Advanced TS', authorId: 1, published: false, tags: ['typescript', 'tips'] })

Comments.add({ id: 1, postId: 1, authorId: 2, content: 'Great post!', createdAt: new Date() })
Comments.add({ id: 2, postId: 1, authorId: 3, content: 'Thanks for sharing', createdAt: new Date() })

// Type-safe queries
const publishedPosts = Posts.where(p => p.published)
const postComments = Comments.whereEquals('postId', 1)

console.log('\n📝 Published posts:', publishedPosts.map(p => p.title))
console.log('💬 Comments on post 1:', postComments.length)

// Type-safe API function
async function getPostWithComments(postId: number): Promise<{
  post: typeof Post.T
  comments: typeof Comment.T[]
} | null> {
  const post = Posts.byId(postId)
  if (!post) return null
  
  const comments = Comments.whereEquals('postId', postId)
  return { post, comments }
}

// Usage
getPostWithComments(1).then(result => {
  if (result) {
    console.log(`\n📄 ${result.post.title}`)
    console.log(`   ${result.comments.length} comments`)
  }
})
