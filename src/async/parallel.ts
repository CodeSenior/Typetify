/**
 * Runs async functions in parallel with a concurrency limit.
 *
 * @example
 * const urls = ['url1', 'url2', 'url3', 'url4', 'url5']
 * const results = await parallel(
 *   urls.map(url => () => fetch(url)),
 *   { concurrency: 2 }
 * )
 */
export async function parallel<T>(
  tasks: readonly (() => Promise<T>)[],
  options: { concurrency?: number } = {}
): Promise<T[]> {
  const { concurrency = Infinity } = options

  if (tasks.length === 0) {
    return []
  }

  if (concurrency === Infinity || concurrency >= tasks.length) {
    return Promise.all(tasks.map((task) => task()))
  }

  const results: T[] = new Array(tasks.length)
  let currentIndex = 0

  async function runNext(): Promise<void> {
    while (currentIndex < tasks.length) {
      const index = currentIndex++
      const task = tasks[index]
      if (task) {
        results[index] = await task()
      }
    }
  }

  const workers = Array.from(
    { length: Math.min(concurrency, tasks.length) },
    () => runNext()
  )

  await Promise.all(workers)

  return results
}
