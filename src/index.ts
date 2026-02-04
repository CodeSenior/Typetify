// Core
export {
  isDefined,
  isNil,
  assert,
  assertDefined,
  fail,
  noop,
  identity,
  unreachable,
} from './core'

// Guards
export {
  isObject,
  isPlainObject,
  isString,
  isNumber,
  isBoolean,
  isFunction,
  isArray,
  isDate,
  isPromise,
  isError,
  isSymbol,
  hasKey,
  hasKeys,
  isEmpty,
  isNonEmpty,
} from './guards'

// Object
export {
  pick,
  omit,
  keysTyped,
  valuesTyped,
  entriesTyped,
  fromEntriesTyped,
  mapObject,
  filterObject,
  mergeShallow,
  clone,
  cloneDeep,
  get,
  set,
  invert,
  deepMerge,
  isEqual,
  has,
  unset,
  paths,
  transform,
} from './object'

// Async
export {
  awaitTo,
  sleep,
  withTimeout,
  retry,
  debounce,
  throttle,
  once,
  onceAsync,
  defer,
  parallel,
} from './async'
export type { RetryOptions, Deferred } from './async'

// Collection
export {
  unique,
  groupBy,
  indexBy,
  partition,
  chunk,
  compact,
  flatten,
  sortBy,
  first,
  last,
  range,
  shuffle,
  sample,
  zip,
  unzip,
  difference,
  intersection,
  take,
  drop,
  takeWhile,
  dropWhile,
  findLast,
  countBy,
  maxBy,
  minBy,
  sumBy,
  head,
  tail,
  init,
} from './collection'

// Input
export {
  safeJsonParse,
  safeJsonStringify,
  parseNumber,
  parseInteger,
  parseBoolean,
  parseDate,
  coerceString,
  coerceArray,
  trimAll,
  defaults,
  clamp,
  isEmail,
  isUrl,
  isUuid,
  isIpAddress,
  parseUrl,
} from './input'
export type { JsonParseResult, JsonStringifyResult } from './input'

// Flow
export {
  pipe,
  compose,
  tap,
  when,
  unless,
  match,
  tryCatch,
  tryCatchAsync,
  ifElse,
  constant,
} from './flow'
export type { TryCatchResult, TryCatchAsyncResult } from './flow'

// DX
export {
  debug,
  invariant,
  assertNever,
  exhaustive,
  todo,
  deprecated,
  measure,
  measureAsync,
  log,
  setLogLevel,
  getLogLevel,
} from './dx'
export type { MeasureResult, LogLevel } from './dx'

// Typed
export {
  defineConst,
  defineEnum,
  defineTuple,
  createMap,
  createSet,
  brand,
  narrow,
} from './typed'
export type {
  Brand,
  EnumValue,
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
  Dictionary,
  ReadonlyDictionary,
} from './typed'

// String
export {
  capitalize,
  uncapitalize,
  camelCase,
  kebabCase,
  snakeCase,
  pascalCase,
  truncate,
  slugify,
  template,
  words,
} from './string'

// Function
export {
  memoize,
  negate,
  flip,
  partial,
  curry,
  ary,
  unary,
} from './fn'

// Math
export {
  sum,
  average,
  median,
  round,
  randomInt,
  randomFloat,
  percentage,
  min,
  max,
} from './math'

// Result
export {
  ok,
  err,
  some,
  none,
  mapResult,
  mapOption,
  mapErr,
  andThen,
  orElse,
  matchResult,
  matchOption,
  isOk,
  isErr,
  unwrap,
  unwrapOption,
  unwrapOr,
  unwrapOptionOr,
  fromNullable,
  toNullable,
} from './result'
export type {
  Result,
  Ok,
  Err,
  Option,
  Some,
  None,
} from './result'

// Decorators
export {
  Bind,
  Debounce,
  Throttle,
  Memoize,
  Deprecated,
  Measure,
  Retry,
  Validate,
  Log,
  Sealed,
  Frozen,
  Lazy,
} from './decorator'

// ============================================================================
// NAMESPACE EXPORT
// ============================================================================
// Allows importing the entire library under a single namespace alias
// to avoid naming conflicts with your own functions.
//
// Usage:
//   import { T } from 'typetify'
//   // or
//   import * as T from 'typetify'
//
// Then use: T.isDefined(), T.pick(), T.groupBy(), etc.
// ============================================================================

import * as _core from './core'
import * as _guards from './guards'
import * as _object from './object'
import * as _async from './async'
import * as _collection from './collection'
import * as _input from './input'
import * as _flow from './flow'
import * as _dx from './dx'
import * as _string from './string'
import * as _fn from './fn'
import * as _math from './math'
import * as _result from './result'
import * as _decorator from './decorator'

/**
 * Typetify namespace - import all utilities under a single alias (like Lodash)
 * 
 * @example
 * ```typescript
 * import { _ } from 'typetify'
 * 
 * // Now use _.methodName() to avoid conflicts (just like Lodash!)
 * const items = [1, null, 2, undefined, 3]
 * const defined = items.filter(_.isDefined)
 * 
 * const user = { id: 1, name: 'John', password: 'secret' }
 * const safe = _.pick(user, ['id', 'name'])
 * 
 * const [error, data] = await _.awaitTo(fetchUser(id))
 * ```
 */
export const _ = {
  ..._core,
  ..._guards,
  ..._object,
  ..._async,
  ..._collection,
  ..._input,
  ..._flow,
  ..._dx,
  ..._string,
  ..._fn,
  ..._math,
  ..._result,
  ..._decorator,
}

// Also export as default for: import _ from 'typetify'
export default _
