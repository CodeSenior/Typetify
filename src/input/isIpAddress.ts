/**
 * Checks if a string is a valid IPv4 or IPv6 address.
 *
 * @example
 * isIpAddress('192.168.1.1') // true
 * isIpAddress('::1') // true
 * isIpAddress('not-an-ip') // false
 */
export function isIpAddress(str: string): boolean {
  return isIpv4(str) || isIpv6(str)
}

function isIpv4(str: string): boolean {
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  return ipv4Regex.test(str)
}

function isIpv6(str: string): boolean {
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}$|^(?:[0-9a-fA-F]{1,4}:){1,7}:$|^(?:[0-9a-fA-F]{1,4}:){0,6}::(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}$/
  return ipv6Regex.test(str)
}
