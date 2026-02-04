/**
 * Creates an object from entries with proper typing.
 * Unlike Object.fromEntries(), this preserves the key-value types.
 *
 * @example
 * const entries = [['id', 1], ['name', 'John']] as const
 * const obj = fromEntriesTyped(entries)
 * // { id: number, name: string }
 */
export function fromEntriesTyped<K extends PropertyKey, V>(
  entries: readonly (readonly [K, V])[]
): Record<K, V> {
  return Object.fromEntries(entries) as Record<K, V>
}
