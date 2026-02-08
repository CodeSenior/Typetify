# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.1.0] - 2026-02-08

### Added
- **Collection Module**: Added `partitionObject` function

### Changed
- Added Partition module to namespace `_`
- Updated documentation with all new backend-focused utilities
- **BREAKING**: Minor version bump to 4.1.0

## [4.0.1] - 2026-02-07

### Added
- **Encrypt Module** (Backend Focus): 20 functions for cryptography

### Changed
- Added Encrypt module to namespace `_`
- Updated documentation with all new backend-focused utilities
- **BREAKING**: Major version bump to 4.0.1

## [3.0.0] - 2026-02-07

### Added
- **HTTP Module** (Backend Focus): 18 functions for type-safe HTTP requests
  - `request`, `get`, `post`, `put`, `patch`, `del` - HTTP methods with typed responses
  - `buildUrl` - URL construction with query parameters
  - `createHttpClient` - Configurable HTTP client with interceptors
  - `requestWithRetry`, `withRetry` - Automatic retry with exponential backoff
  - `HttpHeaders`, `ContentTypes` - Common HTTP constants
  - `parseAuthHeader`, `bearerAuth`, `basicAuth` - Authentication helpers
  - `parseCookieHeader`, `buildCookieHeader`, `mergeHeaders` - Header utilities

- **DateTime Module** (Backend Focus): 26 functions for date manipulation
  - `toDate`, `formatDate`, `toISODateString`, `toISOString` - Date formatting
  - `toUnixTimestamp`, `fromUnixTimestamp` - Unix timestamp conversion
  - `addTime`, `subtractTime`, `startOf`, `endOf`, `diff` - Date manipulation
  - `isBefore`, `isAfter`, `isSameDate`, `isSameDay`, `isBetween` - Date comparison
  - `isToday`, `isYesterday`, `isTomorrow`, `isPast`, `isFuture` - Relative checks
  - `isLeapYear`, `isWeekend`, `isWeekday` - Date utilities
  - `timeAgo`, `formatDuration`, `parseDuration` - Human-readable durations

- **Path Module** (Backend Focus): 14 functions for path manipulation
  - `parsePath`, `dirname`, `basename`, `extname` - Path parsing
  - `joinPath`, `resolvePath`, `relativePath` - Path joining
  - `normalizePath`, `isAbsolute`, `toPosix`, `toWindows` - Path normalization
  - `removeTrailingSlash`, `ensureTrailingSlash`, `commonPath` - Path utilities

- **Crypto Module** (Backend Focus): 20 functions for cryptography
  - `hash`, `sha256`, `sha512`, `hmac` - Hashing functions
  - `timingSafeEqual` - Timing-safe string comparison
  - `uuid`, `randomBytes`, `randomString`, `randomInt` - Random generation
  - `generateToken`, `urlSafeToken` - Token generation
  - `base64Encode`, `base64Decode`, `base64UrlEncode`, `base64UrlDecode` - Base64 encoding
  - `stringToHex`, `hexToString`, `bytesToHex`, `hexToBytes` - Hex encoding
  - `utf8Encode`, `utf8Decode` - UTF-8 encoding

### Changed
- Added HTTP, DateTime, Path, and Crypto modules to namespace `_`
- Updated documentation with all new backend-focused utilities
- **BREAKING**: Major version bump to 3.0.0

## [2.4.0] - 2026-02-07

### Added
- **DOM Module** (Frontend Focus): 23 functions for type-safe DOM manipulation
  - `querySelector`, `querySelectorAll` - Type-safe element selection
  - `classNames`, `addClass`, `removeClass`, `toggleClass`, `hasClass` - Class management
  - `addEventListener`, `once`, `delegate` - Event handling with cleanup
  - `isInViewport`, `getRect`, `scrollIntoView`, `scrollTo`, `getScrollPosition` - Viewport utilities
  - `setStyle`, `setStyles`, `getComputedStyleValue`, `show`, `hide`, `toggle` - Style manipulation

- **Storage Module** (Frontend Focus): 9 functions for type-safe storage
  - `createStorage`, `localStorageTyped`, `sessionStorageTyped` - Type-safe storage wrappers
  - `withExpiry` - Storage with automatic expiration
  - `createMemoryStorage` - In-memory storage for SSR/testing
  - `getCookie`, `setCookie`, `removeCookie`, `hasCookie` - Cookie management

- **Color Module** (Frontend Focus): 22 functions for color manipulation
  - `hexToRgb`, `rgbToHex`, `rgbToHsl`, `hslToRgb` - Color format conversion
  - `parseColor`, `formatRgb`, `formatHsl` - Color parsing and formatting
  - `lighten`, `darken`, `saturate`, `desaturate`, `opacity`, `mix` - Color manipulation
  - `invert`, `grayscale` - Color transformations
  - `luminance`, `contrast`, `isLight`, `isDark`, `getContrastColor` - Color analysis
  - `isSimilar`, `getDominant`, `getTemperature` - Advanced color utilities

### Changed
- Added DOM, Storage, and Color modules to namespace `_`
- Updated documentation with all new frontend-focused utilities
- Renamed `invert` from color module to `invertColor` to avoid conflict with object module

## [2.3.0] - 2026-02-07

### Added
- **Collection**: 4 new functions
  - `reject` - Returns elements that do NOT match the predicate (opposite of filter)
  - `size` - Returns the size of any collection (array, object, string, Map, Set)
  - `keyBy` - Creates an object indexed by a key function
  - `sampleSize` - Returns N random elements from an array

- **String**: 7 new functions
  - `deburr` - Removes diacritical marks (accents) from strings
  - `escape` - Escapes HTML special characters to prevent XSS
  - `unescape` - Converts HTML entities back to characters
  - `escapeRegExp` - Escapes special RegExp characters
  - `pad` - Pads a string on both sides
  - `padStart` - Pads a string on the left
  - `padEnd` - Pads a string on the right

- **Object**: 4 new functions
  - `findKey` - Finds the first key where predicate returns true
  - `findLastKey` - Finds the last key where predicate returns true
  - `at` - Gets values at multiple paths from an object
  - `invertBy` - Inverts object keys/values with grouping

### Changed
- Updated documentation with all new functions and examples

## [2.2.0] - 2026-02-07

### Changed
- Version bump for documentation updates

## [2.1.0] - 2026-02-07

### Added
- **Namespace Export Fix**: All categories now properly exported in `_` namespace
  - Added `logic` module (28 functions: `when`, `unless`, `ifElse`, `cond`, etc.)
  - Added `iterator` module (24 functions: `lazyRange`, `lazyMap`, `lazyFilter`, etc.)
  - Added `narrowing` module (34 functions: `filterDefined`, `assertType`, `refine`, etc.)
  - Added `schema` module (27 functions: `string`, `number`, `parse`, `validate`, etc.)
  - Added `array` module (49 functions: `unionWith`, `without`, `union`, etc.)

### Fixed
- Fixed `_.unionWith is not a function` error
- Fixed missing Array category functions in namespace
- Fixed TypeScript unique symbol export limitations for `typed` module

### Changed
- Optimized bundle: enabled minification, removed sourcemaps
- Improved README with comparison table, real-world examples, and migration guide

## [2.0.0] - 2026-02-06

### Added
- 15 new utility modules across 9 new categories:
  - **Reactive**: `signal`, `computed`, `effect`, `batch`, `createUndoableState`
  - **Cache**: `smartCache`, `memoize`
  - **Event**: `createEventBus`, `createTypedEmitter`
  - **Pipeline**: `pipe`, `pipeAsync`, `flow`, `createMiddleware`, `compose`
  - **DI**: `createContainer`, `createTypedContainer`
  - **Env**: `env`, `createEnv`
  - **Router**: `route`, `createRouter`
  - **Form**: `createForm`, `field`
  - **Feature**: `createFeatureFlags`, `flag`

### Changed
- Updated documentation with all new categories
- Enhanced homepage example with type-safe event bus showcase

## [1.0.0] - 2026-02-04

### Added
- Initial public release
- 18 utility modules:
  - **Core**: `isDefined`, `isNil`, `assert`, `assertDefined`, `fail`, `noop`, `identity`, `unreachable`
  - **Guards**: `isObject`, `isString`, `isNumber`, `hasKey`, `hasKeys`, `isEmpty`, and 50+ type guards
  - **Object**: `pick`, `omit`, `keysTyped`, `mapObject`, `get`, `set`, `merge`, `clone`
  - **Async**: `awaitTo`, `retry`, `sleep`, `withTimeout`, `debounce`, `throttle`, `parallel`
  - **Collection**: `unique`, `groupBy`, `partition`, `chunk`, `compact`, `sortBy`, `range`
  - **Input**: `safeJsonParse`, `parseNumber`, `parseBoolean`, `parseDate`, `coerceArray`, `defaults`
  - **Flow**: `pipe`, `tap`, `when`, `match`, `tryCatch`, `ifElse`
  - **DX**: `debug`, `invariant`, `assertNever`, `todo`, `measure`
  - **Typed**: `defineConst`, `defineEnum`, `brand`, `narrow`, `model`, `v`
  - **String**: `capitalize`, `camelCase`, `kebabCase`, `snakeCase`, `truncate`
  - **Fn**: `partial`, `curry`, `once`, `memoize`, `negate`
  - **Math**: `clamp`, `round`, `sum`, `average`, `random`
  - **Result**: `ok`, `err`, `Result`, `fromPromise`, `map`, `flatMap`
  - **Iterator**: `createIterator`, `lazyRange`, `lazyMap`, `lazyFilter`
  - **Decorator**: `memoize`, `debounce`, `throttle`, `log`, `deprecated`
  - **Logic**: `when`, `unless`, `cond`, `match`, `coalesce`, `defaultTo`
  - **Narrowing**: `filterDefined`, `assertType`, `refine`, `narrow`
  - **Schema**: `string`, `number`, `object`, `array`, `parse`, `validate`
- Complete TypeScript support with full type inference
- Zero dependencies
- Tree-shakable ESM and CJS builds
