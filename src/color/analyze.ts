import { hexToRgb, rgbToHsl } from './convert'

/**
 * Calculates the relative luminance of a color.
 *
 * @example
 * luminance('#ffffff'); // => 1 (white)
 * luminance('#000000'); // => 0 (black)
 * luminance('#ff5733'); // => ~0.3
 */
export function luminance(color: string): number {
  const rgb = hexToRgb(color)
  if (!rgb) return 0

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((val) => {
    const v = val / 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })

  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}

/**
 * Calculates the contrast ratio between two colors.
 *
 * @example
 * contrast('#000000', '#ffffff');
 * // => 21 (maximum contrast)
 *
 * @example
 * // Check WCAG AA compliance (4.5:1 for normal text)
 * const ratio = contrast('#333333', '#ffffff');
 * const isAccessible = ratio >= 4.5;
 */
export function contrast(color1: string, color2: string): number {
  const lum1 = luminance(color1)
  const lum2 = luminance(color2)

  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Checks if a color is light.
 *
 * @example
 * isLight('#ffffff'); // => true
 * isLight('#000000'); // => false
 * isLight('#ff5733'); // => false
 *
 * @example
 * // Choose text color based on background
 * const textColor = isLight(bgColor) ? '#000000' : '#ffffff';
 */
export function isLight(color: string): boolean {
  return luminance(color) > 0.5
}

/**
 * Checks if a color is dark.
 *
 * @example
 * isDark('#000000'); // => true
 * isDark('#ffffff'); // => false
 */
export function isDark(color: string): boolean {
  return !isLight(color)
}

/**
 * Gets the best contrasting color (black or white).
 *
 * @example
 * getContrastColor('#ff5733');
 * // => '#ffffff' (white text on orange background)
 *
 * @example
 * getContrastColor('#ffff00');
 * // => '#000000' (black text on yellow background)
 *
 * @example
 * // Dynamic text color for buttons
 * button.style.color = getContrastColor(button.style.backgroundColor);
 */
export function getContrastColor(color: string): string {
  return isLight(color) ? '#000000' : '#ffffff'
}

/**
 * Checks if two colors are similar.
 *
 * @example
 * isSimilar('#ff5733', '#ff5734', 1);
 * // => true (very similar)
 *
 * @example
 * isSimilar('#ff0000', '#00ff00', 50);
 * // => false (very different)
 */
export function isSimilar(color1: string, color2: string, threshold: number = 10): boolean {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return false

  const diff = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2)
  )

  return diff <= threshold
}

/**
 * Gets the dominant color component.
 *
 * @example
 * getDominant('#ff5733');
 * // => 'red'
 *
 * @example
 * getDominant('#00ff00');
 * // => 'green'
 */
export function getDominant(color: string): 'red' | 'green' | 'blue' | null {
  const rgb = hexToRgb(color)
  if (!rgb) return null

  const max = Math.max(rgb.r, rgb.g, rgb.b)

  if (rgb.r === max) return 'red'
  if (rgb.g === max) return 'green'
  return 'blue'
}

/**
 * Gets the temperature of a color (warm or cool).
 *
 * @example
 * getTemperature('#ff5733');
 * // => 'warm' (orange/red)
 *
 * @example
 * getTemperature('#3366ff');
 * // => 'cool' (blue)
 */
export function getTemperature(color: string): 'warm' | 'cool' | 'neutral' {
  const rgb = hexToRgb(color)
  if (!rgb) return 'neutral'

  const hsl = rgbToHsl(rgb)

  // Warm: red, orange, yellow (0-60°)
  // Cool: blue, cyan, purple (180-300°)
  if (hsl.h >= 0 && hsl.h <= 60) return 'warm'
  if (hsl.h >= 180 && hsl.h <= 300) return 'cool'

  return 'neutral'
}
