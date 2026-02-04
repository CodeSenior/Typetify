/**
 * Creates a throttled version of a function.
 * The function will only be called at most once per specified interval.
 *
 * @example
 * const throttledScroll = throttle(() => {
 *   console.log('Scroll event')
 * }, 100)
 *
 * window.addEventListener('scroll', throttledScroll)
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  interval: number
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const throttled = (...args: Parameters<T>): void => {
    const now = Date.now()
    const remaining = interval - (now - lastCall)

    if (remaining <= 0) {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
        timeoutId = undefined
      }
      lastCall = now
      fn(...args)
    } else if (timeoutId === undefined) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = undefined
        fn(...args)
      }, remaining)
    }
  }

  throttled.cancel = (): void => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
      timeoutId = undefined
    }
  }

  return throttled
}
