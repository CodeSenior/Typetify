# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
