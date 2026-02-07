/**
 * RGB color representation.
 */
export interface RGB {
  r: number // 0-255
  g: number // 0-255
  b: number // 0-255
}

/**
 * HSL color representation.
 */
export interface HSL {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
}

/**
 * Converts hex color to RGB.
 *
 * @example
 * hexToRgb('#ff5733');
 * // => { r: 255, g: 87, b: 51 }
 *
 * @example
 * hexToRgb('#f57'); // Short format
 * // => { r: 255, g: 85, b: 119 }
 *
 * @example
 * hexToRgb('ff5733'); // Without #
 * // => { r: 255, g: 87, b: 51 }
 */
export function hexToRgb(hex: string): RGB | null {
  const cleaned = hex.replace(/^#/, '')

  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0]! + cleaned[0]!, 16)
    const g = parseInt(cleaned[1]! + cleaned[1]!, 16)
    const b = parseInt(cleaned[2]! + cleaned[2]!, 16)
    return { r, g, b }
  }

  if (cleaned.length === 6) {
    const r = parseInt(cleaned.substring(0, 2), 16)
    const g = parseInt(cleaned.substring(2, 4), 16)
    const b = parseInt(cleaned.substring(4, 6), 16)
    return { r, g, b }
  }

  return null
}

/**
 * Converts RGB to hex color.
 *
 * @example
 * rgbToHex({ r: 255, g: 87, b: 51 });
 * // => '#ff5733'
 *
 * @example
 * rgbToHex({ r: 0, g: 0, b: 0 });
 * // => '#000000'
 */
export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`
}

/**
 * Converts RGB to HSL.
 *
 * @example
 * rgbToHsl({ r: 255, g: 87, b: 51 });
 * // => { h: 11, s: 100, l: 60 }
 */
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255
  const g = rgb.g / 255
  const b = rgb.b / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (diff !== 0) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / diff + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / diff + 2) / 6
        break
      case b:
        h = ((r - g) / diff + 4) / 6
        break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

/**
 * Converts HSL to RGB.
 *
 * @example
 * hslToRgb({ h: 11, s: 100, l: 60 });
 * // => { r: 255, g: 87, b: 51 }
 */
export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360
  const s = hsl.s / 100
  const l = hsl.l / 100

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

/**
 * Parses a color string to RGB.
 *
 * @example
 * parseColor('#ff5733');
 * // => { r: 255, g: 87, b: 51 }
 *
 * @example
 * parseColor('rgb(255, 87, 51)');
 * // => { r: 255, g: 87, b: 51 }
 */
export function parseColor(color: string): RGB | null {
  // Hex format
  if (color.startsWith('#')) {
    return hexToRgb(color)
  }

  // RGB format
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]!, 10),
      g: parseInt(rgbMatch[2]!, 10),
      b: parseInt(rgbMatch[3]!, 10),
    }
  }

  return null
}

/**
 * Formats RGB to CSS rgb() string.
 *
 * @example
 * formatRgb({ r: 255, g: 87, b: 51 });
 * // => 'rgb(255, 87, 51)'
 */
export function formatRgb(rgb: RGB): string {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

/**
 * Formats HSL to CSS hsl() string.
 *
 * @example
 * formatHsl({ h: 11, s: 100, l: 60 });
 * // => 'hsl(11, 100%, 60%)'
 */
export function formatHsl(hsl: HSL): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`
}
