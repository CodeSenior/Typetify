/**
 * Logic utilities to replace ternaries, logical operators, and optional chaining.
 */

// Ternary replacements
export { when, whenValue } from './when.js'
export { unless, unlessValue } from './unless.js'
export { ifElse, ifElseLazy } from './ifElse.js'
export { cond, condLazy, condBy } from './cond.js'
export { matchValue, matchWithDefault, matchLazy, matchType } from './match.js'

// Logical operator replacements
export { and, allTrue, andThen } from './and.js'
export { or, anyTrue, orThen } from './or.js'
export { not, notFn } from './not.js'
export { coalesce, coalesceLazy } from './coalesce.js'
export { defaultTo, defaultToLazy, defaultToIf, defaultToIfEmpty } from './defaultTo.js'
export { firstTruthy, firstWhere, firstDefined } from './firstTruthy.js'
export { allTruthy, allWhere, allDefined } from './allTruthy.js'

// Optional chaining helpers
export { get, getTyped, getPath } from './get.js'
export { getOr, getPathOr, getOrLazy } from './getOr.js'
export { tryGet, tryGetOr, tryGetResult } from './tryGet.js'
export { safe, unwrap } from './safe.js'
export { chain, type Chain } from './chain.js'
export { optional, optionalOr, optionalChain } from './optional.js'
