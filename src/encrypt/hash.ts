/**
 * Hash algorithm type.
 */
export type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'

/**
 * Hashes a string using the specified algorithm.
 *
 * @example
 * await hash('hello world', 'SHA-256');
 * // => 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
 *
 * @example
 * await hash('password123', 'SHA-512');
 * // => '...' (128 character hex string)
 */
export async function hash(data: string, algorithm: HashAlgorithm = 'SHA-256'): Promise<string> {
  const encoder = new TextEncoder()
  const dataBuffer = encoder.encode(data)
  const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Hashes a string using SHA-256.
 *
 * @example
 * await sha256('hello world');
 * // => 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
 */
export async function sha256(data: string): Promise<string> {
  return hash(data, 'SHA-256')
}

/**
 * Hashes a string using SHA-512.
 *
 * @example
 * await sha512('hello world');
 * // => '...' (128 character hex string)
 */
export async function sha512(data: string): Promise<string> {
  return hash(data, 'SHA-512')
}

/**
 * Creates an HMAC signature.
 *
 * @example
 * await hmac('message', 'secret-key', 'SHA-256');
 * // => '...' (hex string)
 *
 * @example
 * // Verify webhook signature
 * const signature = await hmac(payload, webhookSecret);
 * if (signature === receivedSignature) {
 *   // Valid signature
 * }
 */
export async function hmac(
  data: string,
  key: string,
  algorithm: HashAlgorithm = 'SHA-256'
): Promise<string> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(key)
  const dataBuffer = encoder.encode(data)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  )

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, dataBuffer)
  const hashArray = Array.from(new Uint8Array(signature))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

/**
 * Compares two strings in constant time to prevent timing attacks.
 *
 * @example
 * const isValid = timingSafeEqual(providedHash, expectedHash);
 */
export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false

  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }

  return result === 0
}
