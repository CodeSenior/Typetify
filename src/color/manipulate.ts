import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, type RGB } from './convert'

/**
 * Lightens a color by a percentage.
 *
 * @example
 * lighten('#ff5733', 20);
 * // => '#ff8566' (20% lighter)
 *
 * @example
 * // Lighten red
 * lighten('#ff0000', 50);
 * // => '#ff8080'
 */
export function lighten(color: string, amount: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const hsl = rgbToHsl(rgb)
  hsl.l = Math.min(100, hsl.l + amount)

  return rgbToHex(hslToRgb(hsl))
}

/**
 * Darkens a color by a percentage.
 *
 * @example
 * darken('#ff5733', 20);
 * // => '#cc2900' (20% darker)
 *
 * @example
 * // Darken blue
 * darken('#0000ff', 30);
 * // => '#000099'
 */
export function darken(color: string, amount: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const hsl = rgbToHsl(rgb)
  hsl.l = Math.max(0, hsl.l - amount)

  return rgbToHex(hslToRgb(hsl))
}

/**
 * Saturates a color by a percentage.
 *
 * @example
 * saturate('#ff5733', 20);
 * // => More vibrant color
 */
export function saturate(color: string, amount: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const hsl = rgbToHsl(rgb)
  hsl.s = Math.min(100, hsl.s + amount)

  return rgbToHex(hslToRgb(hsl))
}

/**
 * Desaturates a color by a percentage.
 *
 * @example
 * desaturate('#ff5733', 50);
 * // => More gray color
 */
export function desaturate(color: string, amount: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const hsl = rgbToHsl(rgb)
  hsl.s = Math.max(0, hsl.s - amount)

  return rgbToHex(hslToRgb(hsl))
}

/**
 * Adjusts the opacity of a color.
 *
 * @example
 * opacity('#ff5733', 0.5);
 * // => 'rgba(255, 87, 51, 0.5)'
 *
 * @example
 * // Create semi-transparent overlay
 * const overlay = opacity('#000000', 0.3);
 */
export function opacity(color: string, alpha: number): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const a = Math.max(0, Math.min(1, alpha))
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})`
}

/**
 * Mixes two colors together.
 *
 * @example
 * mix('#ff0000', '#0000ff', 0.5);
 * // => '#800080' (purple - 50% mix)
 *
 * @example
 * // More red
 * mix('#ff0000', '#0000ff', 0.75);
 * // => '#bf0040'
 */
export function mix(color1: string, color2: string, weight: number = 0.5): string {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return color1

  const w = Math.max(0, Math.min(1, weight))

  const mixed: RGB = {
    r: Math.round(rgb1.r * w + rgb2.r * (1 - w)),
    g: Math.round(rgb1.g * w + rgb2.g * (1 - w)),
    b: Math.round(rgb1.b * w + rgb2.b * (1 - w)),
  }

  return rgbToHex(mixed)
}

/**
 * Inverts a color.
 *
 * @example
 * invert('#ff5733');
 * // => '#00a8cc' (inverted)
 *
 * @example
 * invert('#000000');
 * // => '#ffffff'
 */
export function invert(color: string): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  return rgbToHex({
    r: 255 - rgb.r,
    g: 255 - rgb.g,
    b: 255 - rgb.b,
  })
}

/**
 * Converts color to grayscale.
 *
 * @example
 * grayscale('#ff5733');
 * // => '#8c8c8c' (gray version)
 */
export function grayscale(color: string): string {
  const rgb = hexToRgb(color)
  if (!rgb) return color

  const gray = Math.round(0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b)

  return rgbToHex({ r: gray, g: gray, b: gray })
}
