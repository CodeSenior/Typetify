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
  castArray,
  cloneWith,
  cloneDeepWith,
  conformsTo,
  eq,
  gt,
  gte,
  lt,
  lte,
  isArguments,
  isArrayBuffer,
  isArrayLike,
  isArrayLikeObject,
  isBuffer,
  isElement,
  isEqualWith,
  isFinite,
  isInteger,
  isLength,
  isMap,
  isMatch,
  isMatchWith,
  isNaN,
  isNative,
  isNull,
  isUndefined,
  isObjectLike,
  isRegExp,
  isSafeInteger,
  isSet,
  isTypedArray,
  isWeakMap,
  isWeakSet,
  toArray,
  toFinite,
  toInteger,
  toLength,
  toNumber,
  toPlainObject,
  toSafeInteger,
  toString,
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
  findKey,
  findLastKey,
  at,
  invertBy,
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
  reject,
  size,
  keyBy,
  sampleSize,
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
  deburr,
  escape,
  unescape,
  escapeRegExp,
  pad,
  padStart,
  padEnd,
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

// Reactive
export {
  signal,
  computed,
  effect,
  batch,
  createUndoableState,
  createAutoUndoableState,
} from './reactive'
export type { Signal, ReadonlySignal, UndoableState, UndoableOptions } from './reactive'

// Cache
export { smartCache, memoize as smartMemoize } from './cache'
export type { CacheOptions } from './cache'

// Event
export { createEventBus, createTypedEmitter } from './event'
export type { EventBus } from './event'

// Pipeline
export { pipe as pipeValue, pipeAsync, flow } from './pipeline'
export { createMiddleware, compose as composeMiddleware } from './pipeline'
export type { Middleware, MiddlewarePipeline } from './pipeline'

// DI
export { createContainer, createTypedContainer } from './di'
export type { Container } from './di'

// Env
export { env, createEnv } from './env'

// Router
export { route, createRouter } from './router'
export type { Route, Router } from './router'

// Form
export { createForm, field } from './form'
export type { FormState, FieldState } from './form'

// Feature Flags
export { createFeatureFlags, flag } from './feature'
export type { FeatureFlags } from './feature'

// DOM
export {
  querySelector,
  querySelectorAll,
  classNames,
  addClass,
  removeClass,
  toggleClass,
  hasClass,
  addEventListener,
  once as onceEvent,
  delegate,
  isInViewport,
  getRect,
  scrollIntoView,
  scrollTo,
  getScrollPosition,
  setStyle,
  setStyles,
  getComputedStyleValue,
  getComputedStyles,
  show,
  hide,
  toggle,
} from './dom'

// Storage
export {
  createStorage,
  localStorageTyped,
  sessionStorageTyped,
  withExpiry,
  createMemoryStorage,
  getCookie,
  setCookie,
  removeCookie,
  hasCookie,
} from './storage'
export type { StorageOptions, TypedStorage, ExpiryStorageOptions, ExpiryStorage, CookieOptions } from './storage'

// Color
export {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  parseColor,
  formatRgb,
  formatHsl,
  lighten,
  darken,
  saturate,
  desaturate,
  opacity,
  mix,
  invert as invertColor,
  grayscale,
  luminance,
  contrast,
  isLight,
  isDark,
  getContrastColor,
  isSimilar,
  getDominant,
  getTemperature,
} from './color'
export type { RGB, HSL } from './color'

// HTTP
export {
  request as httpRequest,
  get as httpGet,
  post as httpPost,
  put as httpPut,
  patch as httpPatch,
  del as httpDelete,
  buildUrl,
  HttpError,
  createHttpClient,
  requestWithRetry,
  withRetry,
  HttpHeaders,
  ContentTypes,
  parseAuthHeader,
  bearerAuth,
  basicAuth,
  parseCookieHeader,
  buildCookieHeader,
  mergeHeaders,
} from './http'
export type { RequestOptions, HttpResponse, HttpClientConfig, HttpClient, RetryOptions as HttpRetryOptions } from './http'

// DateTime
export {
  toDate,
  formatDate,
  toISODateString,
  toISOString,
  toUnixTimestamp,
  fromUnixTimestamp,
  addTime,
  subtractTime,
  startOf,
  endOf,
  diff,
  isBefore,
  isAfter,
  isSameDate,
  isSameDay,
  isBetween,
  isToday,
  isYesterday,
  isTomorrow,
  isPast,
  isFuture,
  isLeapYear,
  isWeekend,
  isWeekday,
  timeAgo,
  formatDuration,
  parseDuration,
} from './datetime'
export type { DateInput, DurationUnit, RelativeTimeOptions } from './datetime'

// Path
export {
  parsePath,
  dirname,
  basename,
  extname,
  joinPath,
  resolvePath,
  relativePath,
  normalizePath,
  isAbsolute as isAbsolutePath,
  toPosix,
  toWindows,
  removeTrailingSlash,
  ensureTrailingSlash,
  commonPath,
} from './path'
export type { ParsedPath } from './path'

// Crypto
export {
  hash,
  sha256,
  sha512,
  hmac,
  timingSafeEqual,
  uuid,
  randomBytes,
  randomString,
  randomInt as cryptoRandomInt,
  generateToken,
  urlSafeToken,
  base64Encode,
  base64Decode,
  base64UrlEncode,
  base64UrlDecode,
  stringToHex,
  hexToString,
  bytesToHex,
  hexToBytes,
  utf8Encode,
  utf8Decode,
} from './encrypt'
export type { HashAlgorithm } from './encrypt'

// Array
export {
  concat,
  differenceBy,
  differenceWith,
  dropRight,
  dropRightWhile,
  fill,
  findIndex,
  findLastIndex,
  flattenDeep,
  flattenDepth,
  fromPairs,
  indexOf,
  intersectionBy,
  intersectionWith,
  join,
  lastIndexOf,
  nth,
  pull,
  pullAll,
  pullAllBy,
  pullAllWith,
  pullAt,
  remove,
  reverse,
  slice,
  sortedIndex,
  sortedIndexBy,
  sortedIndexOf,
  sortedLastIndex,
  sortedLastIndexBy,
  sortedLastIndexOf,
  sortedUniq,
  sortedUniqBy,
  takeRight,
  takeRightWhile,
  union,
  unionBy,
  unionWith,
  uniqBy,
  uniqWith,
  unzipWith,
  without,
  xor,
  xorBy,
  xorWith,
  zipObject,
  zipObjectDeep,
  zipWith,
} from './array'

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
import * as _array from './array'
// Note: _typed excluded from namespace due to unique symbol export limitations
import * as _logic from './logic'
import * as _iterator from './iterator'
import * as _narrowing from './narrowing'
import * as _schema from './schema'
import * as _reactive from './reactive'
import * as _cache from './cache'
import * as _event from './event'
import * as _pipeline from './pipeline'
import * as _di from './di'
import * as _env from './env'
import * as _router from './router'
import * as _form from './form'
import * as _feature from './feature'
import * as _dom from './dom'
import * as _storage from './storage'
import * as _color from './color'
import * as _http from './http'
import * as _datetime from './datetime'
import * as _path from './path'
import * as _encrypt from './encrypt'

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
  ..._array,
  // typed: excluded due to unique symbol export limitations - use direct imports
  ..._logic,
  ..._iterator,
  ..._narrowing,
  ..._schema,
  ..._reactive,
  ..._cache,
  ..._event,
  ..._pipeline,
  ..._di,
  ..._env,
  ..._router,
  ..._form,
  ..._feature,
  ..._dom,
  ..._storage,
  ..._color,
  ..._http,
  ..._datetime,
  ..._path,
  ..._encrypt,
} as const

export default _
