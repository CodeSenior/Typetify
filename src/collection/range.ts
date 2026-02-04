/**
 * Creates an array of numbers from start to end (exclusive).
 *
 * @example
 * range(0, 5) // [0, 1, 2, 3, 4]
 * range(1, 10, 2) // [1, 3, 5, 7, 9]
 */
export function range(start: number, end: number, step: number = 1): number[] {
  if (step === 0) {
    throw new Error('Step cannot be 0')
  }

  const result: number[] = []

  if (step > 0) {
    for (let i = start; i < end; i += step) {
      result.push(i)
    }
  } else {
    for (let i = start; i > end; i += step) {
      result.push(i)
    }
  }

  return result
}
