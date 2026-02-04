/**
 * Returns the value if defined, otherwise returns the default value.
 * Unlike the ?? operator, this also handles empty strings.
 *
 * @example
 * defaults(null, 'default') // 'default'
 * defaults(undefined, 'default') // 'default'
 * defaults('', 'default') // 'default'
 * defaults('value', 'default') // 'value'
 * defaults(0, 10) // 0 (0 is a valid value)
 */
export function defaults<T>(
  value: T | null | undefined,
  defaultValue: T,
  options: { treatEmptyStringAsNull?: boolean } = {}
): T {
  const { treatEmptyStringAsNull = true } = options

  if (value === null || value === undefined) {
    return defaultValue
  }

  if (treatEmptyStringAsNull && value === '') {
    return defaultValue
  }

  return value
}
