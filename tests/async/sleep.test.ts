import { describe, it, expect } from 'vitest'
import { sleep } from '../../src/async/sleep'

describe('sleep', () => {
  it('resolves after specified time', async () => {
    const start = Date.now()
    await sleep(50)
    const elapsed = Date.now() - start
    expect(elapsed).toBeGreaterThanOrEqual(45)
  })
})
