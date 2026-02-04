import { describe, it, expect, vi } from 'vitest'
import { retry } from '../../src/async/retry'

describe('retry', () => {
  it('returns result on first success', async () => {
    const fn = vi.fn().mockResolvedValue('success')
    const result = await retry(fn, { attempts: 3 })
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on failure', async () => {
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success')

    const result = await retry(fn, { attempts: 3, delay: 10 })
    expect(result).toBe('success')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('throws after max attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fails'))

    await expect(retry(fn, { attempts: 3, delay: 10 })).rejects.toThrow(
      'always fails'
    )
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('calls onRetry callback', async () => {
    const onRetry = vi.fn()
    const fn = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('success')

    await retry(fn, { attempts: 3, delay: 10, onRetry })
    expect(onRetry).toHaveBeenCalledTimes(1)
    expect(onRetry).toHaveBeenCalledWith(expect.any(Error), 1)
  })
})
