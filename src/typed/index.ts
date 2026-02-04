export { defineConst } from './defineConst'
export { defineEnum } from './defineEnum'
export type { EnumValue } from './defineEnum'
export { defineTuple } from './defineTuple'
export { createMap } from './createMap'
export { createSet } from './createSet'
export { brand } from './brand'
export type { Brand } from './brand'
export { narrow } from './narrow'
export { createBuilder, defineStateMachine, createActions, createTypedEmitter, createReducer } from './builder'
export type { DiscriminatedUnion } from './builder'

// Model Definition (Lego-style type building)
export { defineModel, model, mergeModels, pickModel, omitModel, t } from './model'
export type { Infer as InferModel } from './model'

// Zero-Effort Validators (v.string, v.object, etc.)
export { v } from './v'
export type { Validator, ObjectValidator } from './v'

// Type-Safe Collections
export { collection, collectionWithId, persistentCollection, createCollection } from './collection'
export type { Collection, CollectionWithId, PersistentCollection } from './collection'

// Meta-Types (Pre-built state patterns)
export {
  asyncData,
  formState,
  modalState,
  undoable,
} from './states'
export type {
  AsyncData,
  AsyncDataWithRefresh,
  FormState,
  PaginatedData,
  AsyncPaginatedData,
  ResourceState,
  CollectionState,
  ModalState,
  SelectionState,
  WizardState,
  NotificationState,
  FilterState,
  UndoableState,
  Build,
  TypeBuilder,
} from './states'

// Pattern Matching
export { match, matchValue, matchUnion, createMatcher } from './match'
export type { DiscriminantValue, ExtractByDiscriminant, DiscriminantValues } from './match'

// Union & Intersection Utilities
export type {
  Discriminate,
  ExcludeDiscriminant,
  UnionDiscriminants,
  UnionToTuple,
  UnionLength,
  UnionContains,
  TupleToUnion as TupleToUnionType,
  SafeMerge,
  DeepMerge as DeepMergeType,
  MergeAll,
  CommonKeys,
  DifferentKeys,
  SameTypeKeys,
  IntersectionIsNever,
  ConflictingKeys,
  VariantUnion,
  TaggedUnion,
  TypedUnion,
  NarrowUnion,
  Widen as WidenType,
  NonNullableUnion,
  ExtractObjects,
  ExtractPrimitives,
} from './union'

// Type Debugging
export {
  showType,
  assertType as assertTypeDebug,
  impossible,
  identity as identityTyped,
  narrow as narrowTyped,
} from './debug'
export type {
  AssertEqual,
  AssertExtends,
  AssertNotNever,
  AssertNotAny,
  AssertNotUnknown,
  Expand,
  ExpandDeep,
  TypeShape,
  TypeKind,
  Expect,
  ExpectFalse,
  Equal,
  NotEqual,
  IsAny as IsAnyDebug,
  IsNever as IsNeverDebug,
  IsUnknown as IsUnknownDebug,
  IsUnion as IsUnionDebug,
  IsLiteral as IsLiteralDebug,
  TypeError,
  TypeErrorWithContext,
  Validate,
} from './debug'

// Merge Utilities
export {
  merge,
  mergeAll as mergeAllFn,
  deepMerge as deepMergeFn,
  mergeWith,
  pick as pickTyped,
  omit as omitTyped,
  renameKeys,
  fromEntries,
  mapValues,
  mapKeys,
} from './merge'
export type {
  If,
  Extends,
  Equals,
  IsAny,
  IsNever,
  IsUnknown,
  IsUnion,
  IsTuple,
  IsFunction,
  IsObject,
  IsPrimitive,
  IsLiteral,
  IsNullable,
  ExcludeByValue,
  IncludeByValue,
  OptionalByValue,
  RequiredByValue,
  Switch,
} from './conditional'
export type {
  Infer,
  Constrain,
  Widen,
  Narrow as NarrowType,
  Flatten as FlattenType,
  DeepFlatten,
  Head,
  Tail,
  Last as LastType,
  Init as InitType,
  Prepend,
  Append,
  Concat,
  Reverse,
  Length,
  Repeat as RepeatType,
  Take as TakeType,
  Drop as DropType,
  At,
  Zip as ZipType,
  TupleToUnion,
  TupleToIntersection,
  Split,
  Join,
  Replace,
  Trim,
} from './generic'
export type {
  DeepPartial,
  DeepReadonly,
  DeepRequired,
  ElementOf,
  RequireKeys,
  OptionalKeys,
  KeysOfType,
  Mutable,
  Awaited,
  ValueOf,
  NonNullableDeep,
  Nullable,
  Optional,
  Merge,
  RequireAtLeastOne,
  RequireExactlyOne,
  Prettify,
  PartialBy,
  RequiredBy,
  UnionToIntersection,
  PromiseValue,
  ArrayElement,
  Exact,
  Never,
  DeepMutable,
  RequiredKeys,
  OptionalKeysOf,
  AtLeastOne,
  Dictionary,
  ReadonlyDictionary,
} from './types'
