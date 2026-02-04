import { describe, it, expect } from 'vitest'
import { awaitTo } from '../../src/async/awaitTo'

describe('awaitTo', () => {
  it('returns [null, result] on success', async () => {
    const promise = Promise.resolve('success')
    const [error, result] = await awaitTo(promise)
    expect(error).toBe(null)
    expect(result).toBe('success')
  })

  it('returns [error, null] on failure', async () => {
    const promise = Promise.reject(new Error('failed'))
    const [error, result] = await awaitTo(promise)
    expect(error).toBeInstanceOf(Error)
    expect((error as Error).message).toBe('failed')
    expect(result).toBe(null)
  })
})
