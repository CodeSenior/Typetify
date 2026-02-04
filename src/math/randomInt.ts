/**
 * Returns a random integer between min and max (inclusive).
 *
 * @example
 * randomInt(1, 10) // Random integer from 1 to 10
 * randomInt(0, 100) // Random integer from 0 to 100
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
