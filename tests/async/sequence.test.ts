import { describe, it, expect } from 'vitest'
import { sequence } from '../../src/async/sequence'

describe('sequence', () => {
  it('executes steps in order', async () => {
    const result = await sequence([
      () => Promise.resolve(1),
      (n: number) => Promise.resolve(n + 1),
      (n: number) => Promise.resolve(n * 2)
    ])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual([1, 2, 4])
    }
  })
  
  it('stops at first error', async () => {
    const result = await sequence([
      () => Promise.resolve(1),
      () => Promise.reject(new Error('Failed at step 2')),
      () => Promise.resolve(3)
    ])
    
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.step).toBe(1)
      expect(result.error.message).toBe('Failed at step 2')
      expect(result.partial).toEqual([1])
    }
  })
  
  it('handles async operations with delay', async () => {
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    
    const result = await sequence([
      async () => { await delay(10); return 'a' },
      async (s: string) => { await delay(10); return s + 'b' },
      async (s: string) => { await delay(10); return s + 'c' }
    ])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual(['a', 'ab', 'abc'])
    }
  })
  
  it('works with real-world API example', async () => {
    const fetchUser = (id: number) => Promise.resolve({ id, name: 'John' })
    const fetchProfile = (userId: number) => Promise.resolve({ userId, bio: 'Developer' })
    const fetchOrders = (userId: number) => Promise.resolve([{ id: 1, total: 100 }])
    
    const result = await sequence([
      () => fetchUser(1),
      (user: any) => fetchProfile(user.id),
      (profile: any) => fetchOrders(profile.userId)
    ])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      const [user, profile, orders] = result.data
      expect(user.name).toBe('John')
      expect(profile.bio).toBe('Developer')
      expect(orders).toHaveLength(1)
    }
  })
  
  it('returns partial results on error', async () => {
    const result = await sequence([
      () => Promise.resolve('step1'),
      () => Promise.resolve('step2'),
      () => Promise.reject(new Error('Failed')),
      () => Promise.resolve('step4')
    ])
    
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.partial).toEqual(['step1', 'step2'])
      expect(result.step).toBe(2)
    }
  })
  
  it('handles empty array', async () => {
    const result = await sequence([])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual([])
    }
  })
  
  it('handles single step', async () => {
    const result = await sequence([
      () => Promise.resolve(42)
    ])
    
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.data).toEqual([42])
    }
  })
  
  it('handles non-Error rejections', async () => {
    const result = await sequence([
      () => Promise.resolve(1),
      () => Promise.reject('String error')
    ])
    
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error).toBeInstanceOf(Error)
      expect(result.error.message).toBe('String error')
    }
  })
})
