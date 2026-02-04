/**
 * Narrowing Module
 * 
 * Solutions for TypeScript's type narrowing pain points.
 * Each function transforms uncertain types into certain types.
 */

export { filterDefined, filterDefinedFn } from './filterDefined'
export { filterTruthy, filterTruthyFn } from './filterTruthy'
export { filterByGuard, filterByRefinement, filterBy, partitionByGuard } from './filterByGuard'
export { assertType, assertDefined, assertNotNull, assertCondition, createAssertion } from './assertType'
export { narrowUnion, createDiscriminantGuard, switchUnion, exhaustiveCheck } from './narrowUnion'
export { 
  excludeNull, 
  excludeUndefined, 
  excludeNullish, 
  withDefault, 
  withDefaultLazy, 
  mapNullable, 
  chainNullable 
} from './excludeNull'
export { 
  refine, 
  oneOf, 
  allOf, 
  not, 
  arrayOf, 
  objectOf, 
  literal, 
  optional, 
  nullable 
} from './refine'
export type { TypeGuard, Refinement, GuardedType, Falsy, Truthy, Defined } from './types'
