/**
 * Solutions aux Pain Points TypeScript identifiés par Gemini
 * 
 * Ce fichier démontre comment Typetify résout les 6 principales douleurs
 * des développeurs TypeScript.
 */

// ============================================================================
// PAIN POINT 1: Type Narrowing qui s'évapore
// Problème: users.filter(u => !!u) renvoie toujours (User | null)[]
// ============================================================================

import {
  // Narrowing
  filterDefined,
  filterTruthy,
  filterByGuard,
  partitionByGuard,
  assertDefined,
  narrowUnion,
  switchUnion,
  excludeNullish,
  withDefault,
  mapNullable,
  // Type guard combinators
  oneOf,
  allOf,
  not,
  arrayOf,
  objectOf,
  literal,
  optional,
  nullable,
} from '../src/narrowing'

import { isString, isNumber } from '../src/guards'

// ❌ AVANT: Le type reste (User | null | undefined)[]
interface User {
  id: number
  name: string
  role: 'admin' | 'user'
}

const usersWithNulls: (User | null | undefined)[] = [
  { id: 1, name: 'Alice', role: 'admin' },
  null,
  { id: 2, name: 'Bob', role: 'user' },
  undefined,
]

// ✅ APRÈS: Le type est correctement narrowé à User[]
const users = filterDefined(usersWithNulls)
// Type: User[]

// Avec les valeurs falsy
const mixedValues = ['hello', '', 0, null, 'world', false, 42]
const truthyValues = filterTruthy(mixedValues)
// Type: (string | number)[] - sans les falsy!

// Avec un type guard personnalisé
const isAdmin = (u: User): u is User & { role: 'admin' } => u.role === 'admin'
const admins = filterByGuard(users, isAdmin)
// Type: (User & { role: 'admin' })[]

// Partition: séparer en deux groupes typés
const [adminUsers, regularUsers] = partitionByGuard(users, isAdmin)
// adminUsers: (User & { role: 'admin' })[]
// regularUsers: User[]

console.log('Pain Point 1 - Narrowing:', { users, truthyValues, admins })

// ============================================================================
// PAIN POINT 2: Try/Catch qui perd le type
// Problème: Dans catch(e), e est de type unknown
// ============================================================================

import { tryCatch, tryCatchAsync } from '../src/flow'
import { awaitTo } from '../src/async'
import { ok, err, matchResult, andThen, type Result } from '../src/result'

// ❌ AVANT: try/catch avec unknown
function riskyOld(input: string): number {
  try {
    return JSON.parse(input)
  } catch (e) {
    // e est unknown - on doit faire des checks manuels
    if (e instanceof Error) {
      console.error(e.message)
    }
    return 0
  }
}

// ✅ APRÈS: Result<T, Error> avec type safety complet
function riskyNew(input: string): Result<number, Error> {
  return tryCatch(() => JSON.parse(input))
}

const result = riskyNew('42')
const value = matchResult(result, {
  ok: (n) => `Parsed: ${n}`,
  err: (e) => `Error: ${e.message}`, // e est typé Error!
})

// Chaînage sans try/catch
function parseAndDouble(input: string): Result<number, Error> {
  return andThen(
    tryCatch(() => JSON.parse(input)),
    (n) => typeof n === 'number' ? ok(n * 2) : err(new Error('Not a number'))
  )
}

// Async avec awaitTo (tuple pattern)
async function fetchUserSafe(id: number) {
  const [error, user] = await awaitTo(fetch(`/api/users/${id}`).then(r => r.json()))
  
  if (error) {
    // error est typé Error
    console.error('Fetch failed:', error.message)
    return null
  }
  
  // user est typé (pas unknown!)
  return user
}

console.log('Pain Point 2 - Try/Catch:', value)

// ============================================================================
// PAIN POINT 3: Object.keys/entries qui renvoient string[]
// Problème: Object.keys(obj) renvoie string[] au lieu de (keyof T)[]
// ============================================================================

import { keysTyped, entriesTyped, valuesTyped } from '../src/object'

const config = {
  host: 'localhost',
  port: 3000,
  debug: true,
} as const

// ❌ AVANT: Object.keys renvoie string[]
// const keys = Object.keys(config) // string[]
// config[keys[0]] // Error: string can't index config

// ✅ APRÈS: keysTyped renvoie (keyof T)[]
const keys = keysTyped(config)
// Type: ('host' | 'port' | 'debug')[]

for (const key of keys) {
  const value = config[key] // Pas d'erreur!
  console.log(`${key}: ${value}`)
}

// entriesTyped avec types corrects
for (const [key, value] of entriesTyped(config)) {
  // key: 'host' | 'port' | 'debug'
  // value: string | number | boolean
  console.log(`${key} = ${value}`)
}

console.log('Pain Point 3 - Object.keys:', keys)

// ============================================================================
// PAIN POINT 4: Deep Path Access (user.profile.settings.theme)
// Problème: Accès aux propriétés imbriquées de manière type-safe
// ============================================================================

import { deepGet, deepGetOr, deepSet, deepHas, deepPluck } from '../src/object'

interface AppConfig {
  user: {
    profile: {
      name: string
      settings: {
        theme: 'light' | 'dark'
        notifications: boolean
      }
    }
    preferences?: {
      language: string
    }
  }
  api: {
    baseUrl: string
    timeout: number
  }
}

const appConfig: AppConfig = {
  user: {
    profile: {
      name: 'Alice',
      settings: {
        theme: 'dark',
        notifications: true,
      },
    },
  },
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
  },
}

// ❌ AVANT: Accès verbeux avec optional chaining
// const theme = appConfig?.user?.profile?.settings?.theme

// ✅ APRÈS: deepGet avec autocomplétion et type inference
const theme = deepGet(appConfig, 'user.profile.settings.theme')
// Type: 'light' | 'dark'

// Pour les propriétés optionnelles, deepGet retourne undefined si le chemin n'existe pas
const preferences = deepGet(appConfig, 'user.preferences')
// Type: { language: string } | undefined

// Avec valeur par défaut
const safeTimeout = deepGetOr(appConfig, 'api.timeout', 3000)
// Type: number (jamais undefined)

// Vérifier l'existence
if (deepHas(appConfig, 'user.preferences')) {
  console.log('Preferences are set')
}

// Setter immutable
const updatedConfig = deepSet(appConfig, 'user.profile.settings.theme', 'light')
// Retourne un nouvel objet, l'original est inchangé

// Pluck sur un array
const allUsers: AppConfig[] = [appConfig, appConfig]
const allThemes = deepPluck(allUsers, 'user.profile.settings.theme')
// Type: ('light' | 'dark')[]

console.log('Pain Point 4 - Deep Path:', { theme, safeTimeout })

// ============================================================================
// PAIN POINT 5: JSON.parse qui renvoie any
// Problème: Aucune garantie que l'API renvoie les bons champs
// ============================================================================

import {
  object,
  string,
  number,
  boolean,
  array,
  optional as optionalSchema,
  union,
  literal as literalSchema,
  email,
  safeParse,
  parse,
  is,
  parseJson,
  type Infer,
} from '../src/schema'

// Définir un schéma de validation
const UserSchema = object({
  id: number(),
  name: string(),
  email: email(),
  role: union([literalSchema('admin'), literalSchema('user')]),
  settings: object({
    theme: union([literalSchema('light'), literalSchema('dark')]),
    notifications: boolean(),
  }),
  tags: array(string()),
})

// Inférer le type TypeScript depuis le schéma
type ValidatedUser = Infer<typeof UserSchema>
// Type: {
//   id: number
//   name: string
//   email: string
//   role: 'admin' | 'user'
//   settings: { theme: 'light' | 'dark'; notifications: boolean }
//   tags: string[]
// }

// ❌ AVANT: JSON.parse renvoie any
// const user = JSON.parse(jsonString) as User // Dangereux!

// ✅ APRÈS: Validation runtime avec types
const jsonString = `{
  "id": 1,
  "name": "Alice",
  "email": "alice@example.com",
  "role": "admin",
  "settings": { "theme": "dark", "notifications": true },
  "tags": ["developer", "typescript"]
}`

// Safe parse avec Result
const parseResult = parseJson(UserSchema, jsonString)

if (parseResult.ok) {
  const user = parseResult.value
  // user est complètement typé et validé!
  console.log(`Welcome ${user.name} (${user.role})`)
} else {
  // Erreurs détaillées avec chemin
  for (const error of parseResult.error) {
    console.error(`${error.path.join('.')}: ${error.message}`)
  }
}

// Type guard avec schéma
function processApiResponse(data: unknown) {
  if (is(UserSchema, data)) {
    // data est maintenant ValidatedUser
    console.log(data.email)
  }
}

// Parse qui throw (pour les cas où on veut une exception)
try {
  const user = parse(UserSchema, JSON.parse(jsonString))
  console.log(user.name)
} catch (e) {
  console.error('Validation failed')
}

console.log('Pain Point 5 - JSON Validation:', parseResult.ok ? 'Valid!' : 'Invalid')

// ============================================================================
// PAIN POINT 6: Discriminated Unions et Exhaustive Checks
// ============================================================================

type ApiResponse =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; message: string }

function handleResponse(response: ApiResponse): string {
  // ✅ narrowUnion pour les discriminated unions
  if (narrowUnion(response, 'status', 'success')) {
    // response est { status: 'success'; data: User[] }
    return `Loaded ${response.data.length} users`
  }
  
  if (narrowUnion(response, 'status', 'error')) {
    return `Error: ${response.message}`
  }
  
  return 'Loading...'
}

const apiResponse: ApiResponse = { status: 'success', data: users }
const message = handleResponse(apiResponse)

console.log('Pain Point 6 - Discriminated Unions:', message)

// ============================================================================
// BONUS: Combinateurs de Type Guards
// ============================================================================

// Créer des guards complexes par composition
const isStringOrNumber = oneOf(isString, isNumber)
const isNotNull = not((v: unknown): v is null => v === null)

// Guard pour arrays typés
const isStringArray = arrayOf(isString)

// Guard pour objets avec shape
const isUserShape = objectOf({
  id: isNumber,
  name: isString,
})

// Utilisation
const testData = { id: 1, name: 'Test' }
if (isUserShape(testData)) {
  // testData est validé comme { id: number; name: string }
  console.log(testData.name)
}

console.log('Bonus - Guard Combinators: Working!')

// ============================================================================
// RÉSUMÉ: Typetify transforme les types incertains en types certains
// ============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║                    TYPETIFY PAIN POINTS SOLUTIONS                 ║
╠══════════════════════════════════════════════════════════════════╣
║ 1. Type Narrowing    → filterDefined, filterTruthy, filterByGuard║
║ 2. Try/Catch         → tryCatch, Result<T,E>, awaitTo            ║
║ 3. Object.keys       → keysTyped, entriesTyped, valuesTyped      ║
║ 4. Deep Path Access  → deepGet, deepSet, deepHas (type-safe!)    ║
║ 5. JSON Validation   → Schema validation avec inférence de type  ║
║ 6. Discriminated     → narrowUnion, switchUnion, exhaustiveCheck ║
╚══════════════════════════════════════════════════════════════════╝
`)
