/**
 * Returns a random float between min and max.
 *
 * @example
 * randomFloat(0, 1) // Random float from 0 to 1
 * randomFloat(1.5, 3.5) // Random float from 1.5 to 3.5
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min
}
