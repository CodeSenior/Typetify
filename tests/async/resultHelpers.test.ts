import { describe, it, expect } from 'vitest'
import {
  allResults,
  allResultsSync,
  anyResult,
  anyResultSync,
  partitionResults,
  collectResults
} from '../../src/async/resultHelpers'
import { ok, err } from '../../src/result'

describe('allResults', () => {
  it('returns Ok with all values when all succeed', async () => {
    const result = await allResults([
      Promise.resolve(ok(1)),
      Promise.resolve(ok(2)),
      Promise.resolve(ok(3))
    ])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual([1, 2, 3])
    }
  })
  
  it('returns Err with first error when one fails', async () => {
    const result = await allResults([
      Promise.resolve(ok(1)),
      Promise.resolve(err('failed')),
      Promise.resolve(ok(3))
    ])
    
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('failed')
    }
  })
  
  it('handles empty array', async () => {
    const result = await allResults([])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual([])
    }
  })
})

describe('allResultsSync', () => {
  it('returns Ok with all values when all succeed', () => {
    const result = allResultsSync([ok(1), ok(2), ok(3)])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual([1, 2, 3])
    }
  })
  
  it('returns Err with first error when one fails', () => {
    const result = allResultsSync([ok(1), err('failed'), ok(3)])
    
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('failed')
    }
  })
})

describe('anyResult', () => {
  it('returns first successful result', async () => {
    const result = await anyResult([
      Promise.resolve(err('first error')),
      Promise.resolve(ok(2)),
      Promise.resolve(ok(3))
    ])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toBe(2)
    }
  })
  
  it('returns last error when all fail', async () => {
    const result = await anyResult([
      Promise.resolve(err('error1')),
      Promise.resolve(err('error2')),
      Promise.resolve(err('error3'))
    ])
    
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('error3')
    }
  })
  
  it('returns error for empty array', async () => {
    const result = await anyResult([])
    
    expect(result.ok).toBe(false)
  })
  
  it('returns first Ok immediately', async () => {
    const result = await anyResult([
      Promise.resolve(ok('first')),
      Promise.resolve(err('should not reach'))
    ])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toBe('first')
    }
  })
})

describe('anyResultSync', () => {
  it('returns first successful result', () => {
    const result = anyResultSync([err('a'), ok(2), err('c')])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toBe(2)
    }
  })
  
  it('returns last error when all fail', () => {
    const result = anyResultSync([err('a'), err('b')])
    
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBe('b')
    }
  })
})

describe('partitionResults', () => {
  it('partitions results into successes and failures', () => {
    const results = [ok(1), err('a'), ok(2), err('b'), ok(3)]
    const { successes, failures } = partitionResults(results)
    
    expect(successes).toEqual([1, 2, 3])
    expect(failures).toEqual(['a', 'b'])
  })
  
  it('handles all successes', () => {
    const { successes, failures } = partitionResults([ok(1), ok(2)])
    
    expect(successes).toEqual([1, 2])
    expect(failures).toEqual([])
  })
  
  it('handles all failures', () => {
    const { successes, failures } = partitionResults([err('a'), err('b')])
    
    expect(successes).toEqual([])
    expect(failures).toEqual(['a', 'b'])
  })
  
  it('handles empty array', () => {
    const { successes, failures } = partitionResults([])
    
    expect(successes).toEqual([])
    expect(failures).toEqual([])
  })
})

describe('collectResults', () => {
  it('collects all results without short-circuiting', async () => {
    const { successes, failures } = await collectResults([
      Promise.resolve(ok(1)),
      Promise.resolve(err('error1')),
      Promise.resolve(ok(2)),
      Promise.resolve(err('error2'))
    ])
    
    expect(successes).toEqual([1, 2])
    expect(failures).toEqual(['error1', 'error2'])
  })
})
