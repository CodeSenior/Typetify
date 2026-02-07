/**
 * Pads a string on both sides to reach the target length.
 * If the padding length is odd, the extra character goes to the right.
 *
 * @example
 * // Center text
 * pad('hello', 11)
 * // => '   hello   '
 *
 * @example
 * // Custom padding character
 * pad('5', 3, '0')
 * // => '050'
 *
 * @example
 * // Center with dashes
 * pad('TITLE', 15, '-')
 * // => '-----TITLE-----'
 *
 * @example
 * // No padding if already long enough
 * pad('hello', 3)
 * // => 'hello'
 */
export function pad(str: string, length: number, chars: string = ' '): string {
  const strLength = str.length
  if (strLength >= length || chars.length === 0) {
    return str
  }

  const padLength = length - strLength
  const padLeft = Math.floor(padLength / 2)
  const padRight = padLength - padLeft

  return repeatChars(chars, padLeft) + str + repeatChars(chars, padRight)
}

/**
 * Pads a string on the left (start) to reach the target length.
 *
 * @example
 * // Pad numbers with zeros
 * padStart('5', 3, '0')
 * // => '005'
 *
 * @example
 * // Format time components
 * padStart('9', 2, '0')
 * // => '09'
 *
 * @example
 * // Align text to the right
 * padStart('42', 5)
 * // => '   42'
 *
 * @example
 * // Format IDs
 * padStart('123', 8, '0')
 * // => '00000123'
 */
export function padStart(str: string, length: number, chars: string = ' '): string {
  const strLength = str.length
  if (strLength >= length || chars.length === 0) {
    return str
  }

  return repeatChars(chars, length - strLength) + str
}

/**
 * Pads a string on the right (end) to reach the target length.
 *
 * @example
 * // Align text to the left
 * padEnd('hello', 10)
 * // => 'hello     '
 *
 * @example
 * // Create fixed-width columns
 * padEnd('Name', 20) + padEnd('Age', 5)
 * // => 'Name                Age  '
 *
 * @example
 * // Pad with custom character
 * padEnd('1', 4, '0')
 * // => '1000'
 *
 * @example
 * // Format file sizes
 * padEnd('1.5', 6, '0') + ' MB'
 * // => '1.5000 MB'
 */
export function padEnd(str: string, length: number, chars: string = ' '): string {
  const strLength = str.length
  if (strLength >= length || chars.length === 0) {
    return str
  }

  return str + repeatChars(chars, length - strLength)
}

function repeatChars(chars: string, length: number): string {
  if (length <= 0) return ''
  const repeatCount = Math.ceil(length / chars.length)
  return chars.repeat(repeatCount).slice(0, length)
}
