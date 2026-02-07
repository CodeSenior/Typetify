/**
 * Encodes a string to base64.
 *
 * @example
 * base64Encode('Hello, World!');
 * // => 'SGVsbG8sIFdvcmxkIQ=='
 */
export function base64Encode(data: string): string {
  return btoa(data)
}

/**
 * Decodes a base64 string.
 *
 * @example
 * base64Decode('SGVsbG8sIFdvcmxkIQ==');
 * // => 'Hello, World!'
 */
export function base64Decode(data: string): string {
  return atob(data)
}

/**
 * Encodes a string to URL-safe base64.
 *
 * @example
 * base64UrlEncode('Hello, World!');
 * // => 'SGVsbG8sIFdvcmxkIQ'
 */
export function base64UrlEncode(data: string): string {
  return btoa(data).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/**
 * Decodes a URL-safe base64 string.
 *
 * @example
 * base64UrlDecode('SGVsbG8sIFdvcmxkIQ');
 * // => 'Hello, World!'
 */
export function base64UrlDecode(data: string): string {
  let base64 = data.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4
  if (padding) {
    base64 += '='.repeat(4 - padding)
  }
  return atob(base64)
}

/**
 * Converts a string to hex.
 *
 * @example
 * stringToHex('Hello');
 * // => '48656c6c6f'
 */
export function stringToHex(str: string): string {
  return Array.from(str)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Converts hex to a string.
 *
 * @example
 * hexToString('48656c6c6f');
 * // => 'Hello'
 */
export function hexToString(hex: string): string {
  let result = ''
  for (let i = 0; i < hex.length; i += 2) {
    result += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16))
  }
  return result
}

/**
 * Converts a Uint8Array to hex string.
 *
 * @example
 * bytesToHex(new Uint8Array([72, 101, 108, 108, 111]));
 * // => '48656c6c6f'
 */
export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Converts a hex string to Uint8Array.
 *
 * @example
 * hexToBytes('48656c6c6f');
 * // => Uint8Array([72, 101, 108, 108, 111])
 */
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16)
  }
  return bytes
}

/**
 * Encodes a string to UTF-8 bytes.
 *
 * @example
 * utf8Encode('Hello');
 * // => Uint8Array([72, 101, 108, 108, 111])
 */
export function utf8Encode(str: string): Uint8Array {
  return new TextEncoder().encode(str)
}

/**
 * Decodes UTF-8 bytes to a string.
 *
 * @example
 * utf8Decode(new Uint8Array([72, 101, 108, 108, 111]));
 * // => 'Hello'
 */
export function utf8Decode(bytes: Uint8Array): string {
  return new TextDecoder().decode(bytes)
}
