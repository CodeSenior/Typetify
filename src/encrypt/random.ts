/**
 * Generates a random UUID (v4).
 *
 * @example
 * uuid();
 * // => 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
 */
export function uuid(): string {
  return crypto.randomUUID()
}

/**
 * Generates random bytes as a hex string.
 *
 * @example
 * randomBytes(16);
 * // => '1a2b3c4d5e6f7890abcdef1234567890'
 *
 * @example
 * // Generate a secure token
 * const token = randomBytes(32);
 */
export function randomBytes(length: number): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/**
 * Generates a random string with specified characters.
 *
 * @example
 * randomString(16);
 * // => 'aB3xY9kLmN2pQrSt'
 *
 * @example
 * // Custom alphabet
 * randomString(8, '0123456789');
 * // => '48291037'
 *
 * @example
 * // Generate a password
 * randomString(16, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%');
 */
export function randomString(
  length: number,
  alphabet: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string {
  const bytes = new Uint8Array(length)
  crypto.getRandomValues(bytes)

  let result = ''
  for (let i = 0; i < length; i++) {
    result += alphabet[bytes[i]! % alphabet.length]
  }

  return result
}

/**
 * Generates a random integer between min and max (inclusive).
 *
 * @example
 * randomInt(1, 100);
 * // => 42
 *
 * @example
 * // Generate a random dice roll
 * randomInt(1, 6);
 * // => 4
 */
export function randomInt(min: number, max: number): number {
  const range = max - min + 1
  const bytes = new Uint32Array(1)
  crypto.getRandomValues(bytes)
  return min + (bytes[0]! % range)
}

/**
 * Generates a secure token suitable for authentication.
 *
 * @example
 * generateToken();
 * // => 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
 *
 * @example
 * generateToken(64);
 * // => '...' (64 character token)
 */
export function generateToken(length: number = 32): string {
  return randomBytes(Math.ceil(length / 2)).slice(0, length)
}

/**
 * Generates a URL-safe random string (base64url).
 *
 * @example
 * urlSafeToken(32);
 * // => 'xY9kLmN2pQrSt_aB3-Y9kLmN2pQrSt'
 */
export function urlSafeToken(length: number): string {
  return randomString(length, 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')
}
