/**
 * Clamps a number between a minimum and maximum value.
 *
 * @example
 * clamp(5, 0, 10) // 5
 * clamp(-5, 0, 10) // 0
 * clamp(15, 0, 10) // 10
 */
export function clamp(value: number, min: number, max: number): number {
  if (min > max) {
    throw new Error('min must be less than or equal to max')
  }

  return Math.min(Math.max(value, min), max)
}
