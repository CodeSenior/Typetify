/**
 * Solutions aux problèmes de manipulation de types TypeScript
 * 
 * Ce fichier démontre comment Typetify résout les difficultés
 * que rencontrent les développeurs avec les unions, intersections,
 * et la programmation au niveau des types.
 */

// ============================================================================
// PROBLÈME 1: L'enfer de l'Intersection (&) vs Union (|)
// ============================================================================

import type {
  // Union utilities
  Discriminate,
  ExcludeDiscriminant,
  UnionToTuple,
  SafeMerge,
  DeepMergeType,
  IntersectionIsNever,
  ConflictingKeys,
  VariantUnion,
  TaggedUnion,
  TypedUnion,
  // Type debugging
  Expand,
  ExpandDeep,
  Prettify,
  AssertEqual,
  AssertNotNever,
  Equal,
} from '../src/typed'

import {
  // Pattern matching
  match,
  matchUnion,
  matchValue,
  // Merge functions
  merge,
  deepMergeFn,
  mergeWith,
  // Debug functions
  showType,
  impossible,
} from '../src/typed'

// ❌ PROBLÈME: L'intersection de types avec propriétés conflictuelles = never
type BadIntersection = { name: string } & { name: number }
// BadIntersection['name'] est 'never' car string & number = never

// ✅ SOLUTION: SafeMerge gère proprement les conflits
type A = { name: string; age: number }
type B = { name: string; email: string }
type Merged = SafeMerge<A, B>
// { name: string; age: number; email: string }

// Vérification que le type est correct
type _TestMerge = AssertEqual<Merged, { age: number; name: string; email: string }>

// ✅ SOLUTION: Détecter les conflits avant qu'ils ne causent des problèmes
type Conflicts = ConflictingKeys<{ a: string; b: number }, { a: number; b: number }>
// 'a' - car 'a' a des types différents

type WouldBeNever = IntersectionIsNever<{ a: string }, { a: number }>
// true - avertissement que l'intersection serait never

// ============================================================================
// PROBLÈME 2: Les Discriminated Unions mal comprises
// ============================================================================

// ❌ PROBLÈME: États impossibles avec des booléens
interface BadState {
  isLoading: boolean
  isError: boolean
  data?: User
  error?: Error
}
// Permet isLoading: true ET data: User (état impossible!)

interface User {
  id: number
  name: string
}

// ✅ SOLUTION: Discriminated Union avec VariantUnion
type ApiState = VariantUnion<'status', {
  loading: {}
  success: { data: User }
  error: { message: string }
}>
// Équivalent à:
// | { status: 'loading' }
// | { status: 'success'; data: User }
// | { status: 'error'; message: string }

// ✅ SOLUTION: TaggedUnion pour le pattern 'tag'
type Result<T> = TaggedUnion<{
  ok: { value: T }
  err: { error: Error }
}>
// | { tag: 'ok'; value: T }
// | { tag: 'err'; error: Error }

// ✅ SOLUTION: TypedUnion pour le pattern 'type' (Redux-style)
type Action = TypedUnion<{
  increment: { amount: number }
  decrement: { amount: number }
  reset: {}
}>
// | { type: 'increment'; amount: number }
// | { type: 'decrement'; amount: number }
// | { type: 'reset' }

// ============================================================================
// PROBLÈME 3: Pattern Matching exhaustif
// ============================================================================

// ❌ PROBLÈME: Oublier un cas dans un switch
function handleStateBad(state: ApiState): string {
  switch (state.status) {
    case 'loading': return 'Loading...'
    case 'success': return state.data.name
    case 'error': return state.message
    // Sans Typetify, on peut facilement oublier un cas
  }
}

// ✅ SOLUTION: matchUnion avec exhaustivité garantie
function handleStateGood(state: ApiState): string {
  return matchUnion(state, 'status', {
    loading: () => 'Loading...',
    success: (s) => `Hello ${s.data.name}`,
    error: (s) => `Error: ${s.message}`,
    // TypeScript erreur si on oublie un cas!
  })
}

// ✅ SOLUTION: match() builder pour plus de flexibilité
function handleStateBuilder(state: ApiState): string {
  return match(state, 'status')
    .with('loading', () => 'Loading...')
    .with('success', (s) => `Hello ${s.data.name}`)
    .with('error', (s) => `Error: ${s.message}`)
    .exhaustive() as string
}

// ✅ SOLUTION: matchValue pour les unions simples
type Status = 'pending' | 'active' | 'completed'

function getStatusLabel(status: Status): string {
  return matchValue(status, {
    pending: () => '⏳ En attente',
    active: () => '🔄 En cours',
    completed: () => '✅ Terminé',
  })
}

// ============================================================================
// PROBLÈME 4: Types qui "explosent" (lisibilité)
// ============================================================================

// ❌ PROBLÈME: Types illisibles dans l'IDE
type ComplexType = Pick<Omit<User & { settings: { theme: string } }, 'id'>, 'name' | 'settings'>
// L'infobulle montre: Pick<Omit<User & { settings: { theme: string } }, 'id'>, 'name' | 'settings'>

// ✅ SOLUTION: Expand pour "aplatir" le type
type ReadableType = Expand<ComplexType>
// L'infobulle montre: { name: string; settings: { theme: string } }

// ✅ SOLUTION: ExpandDeep pour les types imbriqués
type NestedComplex = {
  user: Pick<User, 'name'> & { profile: Partial<{ bio: string; avatar: string }> }
}
type ReadableNested = ExpandDeep<NestedComplex>
// Montre la structure complète aplatie

// ✅ SOLUTION: Prettify (déjà dans types.ts)
type PrettyType = Prettify<{ a: 1 } & { b: 2 } & { c: 3 }>
// { a: 1; b: 2; c: 3 }

// ============================================================================
// PROBLÈME 5: Merge intelligent
// ============================================================================

const base = { name: 'John', age: 30, settings: { theme: 'light' } }
const override = { age: 31, settings: { notifications: true } }

// ❌ PROBLÈME: Spread perd la précision des types imbriqués
const badMerge = { ...base, ...override }
// settings est complètement remplacé, pas fusionné

// ✅ SOLUTION: merge() pour fusion simple avec types précis
const simpleMerge = merge(base, override)
// Type préservé correctement

// ✅ SOLUTION: deepMergeFn() pour fusion récursive
const deepMerged = deepMergeFn(base, override)
// settings contient { theme: 'light', notifications: true }

// ✅ SOLUTION: mergeWith() pour contrôle des conflits
const customMerge = mergeWith(
  { count: 10, name: 'A' },
  { count: 5, name: 'B' },
  {
    count: (a, b) => a + b, // Additionner au lieu de remplacer
  }
)
// { count: 15, name: 'B' }

// ============================================================================
// PROBLÈME 6: Extraire des membres d'une union
// ============================================================================

type Event = 
  | { type: 'click'; x: number; y: number }
  | { type: 'keypress'; key: string }
  | { type: 'scroll'; delta: number }

// ✅ SOLUTION: Discriminate pour extraire un membre
type ClickEvent = Discriminate<Event, 'type', 'click'>
// { type: 'click'; x: number; y: number }

// ✅ SOLUTION: ExcludeDiscriminant pour exclure un membre
type NonClickEvent = ExcludeDiscriminant<Event, 'type', 'click'>
// { type: 'keypress'; key: string } | { type: 'scroll'; delta: number }

// ============================================================================
// PROBLÈME 7: Débogage de types
// ============================================================================

// ✅ SOLUTION: showType pour inspecter un type à runtime
const config = { host: 'localhost', port: 3000 } as const
const inspected = showType(config)
// Hover sur 'inspected' pour voir le type exact

// ✅ SOLUTION: AssertEqual pour tests de types
type _Test1 = AssertEqual<string, string> // OK
// type _Test2 = AssertEqual<string, number> // Erreur de compilation!

// ✅ SOLUTION: AssertNotNever pour détecter les types never accidentels
type SafeType = AssertNotNever<string> // OK
// type UnsafeType = AssertNotNever<string & number> // Erreur! C'est never

// ✅ SOLUTION: Equal pour vérifications conditionnelles
type AreEqual = Equal<{ a: 1 }, { a: 1 }> // true
type AreNotEqual = Equal<{ a: 1 }, { a: 2 }> // false

// ✅ SOLUTION: impossible() pour exhaustiveness checking
function processEvent(event: Event): string {
  switch (event.type) {
    case 'click': return `Click at ${event.x}, ${event.y}`
    case 'keypress': return `Key: ${event.key}`
    case 'scroll': return `Scroll: ${event.delta}`
    default: return impossible(event) // Erreur si on oublie un cas
  }
}

// ============================================================================
// PROBLÈME 8: Conversion Union <-> Tuple
// ============================================================================

// ✅ SOLUTION: UnionToTuple pour convertir une union en tuple
type Colors = 'red' | 'green' | 'blue'
type ColorTuple = UnionToTuple<Colors>
// ['red', 'green', 'blue'] (ordre peut varier)

// ============================================================================
// RÉSUMÉ: Typetify masque la complexité derrière des fonctions simples
// ============================================================================

console.log(`
╔══════════════════════════════════════════════════════════════════╗
║           TYPETIFY - MANIPULATION DE TYPES SIMPLIFIÉE            ║
╠══════════════════════════════════════════════════════════════════╣
║                                                                  ║
║  UNIONS & INTERSECTIONS                                          ║
║  ├─ SafeMerge<A, B>      → Fusion sans conflits                  ║
║  ├─ IntersectionIsNever  → Détecte les intersections never       ║
║  ├─ ConflictingKeys      → Trouve les clés en conflit            ║
║  └─ Discriminate         → Extrait un membre d'une union         ║
║                                                                  ║
║  DISCRIMINATED UNIONS                                            ║
║  ├─ VariantUnion         → Crée une union discriminée            ║
║  ├─ TaggedUnion          → Pattern { tag: 'xxx' }                ║
║  ├─ TypedUnion           → Pattern { type: 'xxx' }               ║
║  └─ matchUnion()         → Pattern matching exhaustif            ║
║                                                                  ║
║  LISIBILITÉ DES TYPES                                            ║
║  ├─ Prettify<T>          → Aplatit les intersections             ║
║  ├─ Expand<T>            → Montre le type final                  ║
║  └─ ExpandDeep<T>        → Expansion récursive                   ║
║                                                                  ║
║  MERGE INTELLIGENT                                               ║
║  ├─ merge()              → Fusion simple typée                   ║
║  ├─ deepMergeFn()        → Fusion récursive                      ║
║  └─ mergeWith()          → Fusion avec résolveurs                ║
║                                                                  ║
║  DÉBOGAGE                                                        ║
║  ├─ showType()           → Inspecte un type                      ║
║  ├─ AssertEqual          → Vérifie l'égalité de types            ║
║  ├─ AssertNotNever       → Détecte les types never               ║
║  └─ impossible()         → Exhaustiveness checking               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`)

// ============================================================================
// EXEMPLE COMPLET: API avec états typés
// ============================================================================

// Définition des états possibles
type RequestState<T> = VariantUnion<'status', {
  idle: {}
  loading: { startedAt: Date }
  success: { data: T; fetchedAt: Date }
  error: { error: Error; failedAt: Date }
}>

// Fonction de rendu type-safe
function renderRequest<T>(
  state: RequestState<T>,
  render: { data: (data: T) => string }
): string {
  return matchUnion(state, 'status', {
    idle: () => 'Prêt à charger',
    loading: (s) => `Chargement depuis ${s.startedAt.toISOString()}...`,
    success: (s) => render.data(s.data),
    error: (s) => `Erreur: ${s.error.message}`,
  })
}

// Utilisation
const userState: RequestState<User> = {
  status: 'success',
  data: { id: 1, name: 'Alice' },
  fetchedAt: new Date(),
}

const output = renderRequest(userState, {
  data: (user) => `Utilisateur: ${user.name}`,
})

console.log(output) // "Utilisateur: Alice"
