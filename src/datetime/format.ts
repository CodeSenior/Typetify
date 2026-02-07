/**
 * Date input type - accepts Date, timestamp, or ISO string.
 */
export type DateInput = Date | number | string

/**
 * Converts any date input to a Date object.
 *
 * @example
 * toDate('2024-01-15');
 * // => Date object
 *
 * @example
 * toDate(1705276800000);
 * // => Date object
 */
export function toDate(input: DateInput): Date {
  if (input instanceof Date) return input
  if (typeof input === 'number') return new Date(input)
  return new Date(input)
}

/**
 * Formats a date using a format string.
 *
 * Tokens:
 * - YYYY: 4-digit year
 * - YY: 2-digit year
 * - MM: 2-digit month
 * - M: month
 * - DD: 2-digit day
 * - D: day
 * - HH: 2-digit hour (24h)
 * - H: hour (24h)
 * - hh: 2-digit hour (12h)
 * - h: hour (12h)
 * - mm: 2-digit minutes
 * - m: minutes
 * - ss: 2-digit seconds
 * - s: seconds
 * - SSS: milliseconds
 * - A: AM/PM
 * - a: am/pm
 *
 * @example
 * formatDate(new Date('2024-01-15T14:30:00'), 'YYYY-MM-DD');
 * // => '2024-01-15'
 *
 * @example
 * formatDate(new Date('2024-01-15T14:30:00'), 'DD/MM/YYYY HH:mm');
 * // => '15/01/2024 14:30'
 *
 * @example
 * formatDate(new Date('2024-01-15T14:30:00'), 'hh:mm A');
 * // => '02:30 PM'
 */
export function formatDate(input: DateInput, format: string): string {
  const date = toDate(input)

  const pad = (n: number, len: number = 2) => String(n).padStart(len, '0')

  const hours24 = date.getHours()
  const hours12 = hours24 % 12 || 12
  const isPM = hours24 >= 12

  const tokens: Record<string, string> = {
    YYYY: String(date.getFullYear()),
    YY: String(date.getFullYear()).slice(-2),
    MM: pad(date.getMonth() + 1),
    M: String(date.getMonth() + 1),
    DD: pad(date.getDate()),
    D: String(date.getDate()),
    HH: pad(hours24),
    H: String(hours24),
    hh: pad(hours12),
    h: String(hours12),
    mm: pad(date.getMinutes()),
    m: String(date.getMinutes()),
    ss: pad(date.getSeconds()),
    s: String(date.getSeconds()),
    SSS: pad(date.getMilliseconds(), 3),
    A: isPM ? 'PM' : 'AM',
    a: isPM ? 'pm' : 'am',
  }

  let result = format
  for (const [token, value] of Object.entries(tokens).sort((a, b) => b[0].length - a[0].length)) {
    result = result.replace(new RegExp(token, 'g'), value)
  }

  return result
}

/**
 * Formats a date as ISO string (YYYY-MM-DD).
 *
 * @example
 * toISODateString(new Date('2024-01-15T14:30:00'));
 * // => '2024-01-15'
 */
export function toISODateString(input: DateInput): string {
  return formatDate(input, 'YYYY-MM-DD')
}

/**
 * Formats a date as ISO datetime string.
 *
 * @example
 * toISOString(new Date('2024-01-15T14:30:00'));
 * // => '2024-01-15T14:30:00.000Z'
 */
export function toISOString(input: DateInput): string {
  return toDate(input).toISOString()
}

/**
 * Formats a date as Unix timestamp (seconds).
 *
 * @example
 * toUnixTimestamp(new Date('2024-01-15T00:00:00Z'));
 * // => 1705276800
 */
export function toUnixTimestamp(input: DateInput): number {
  return Math.floor(toDate(input).getTime() / 1000)
}

/**
 * Creates a Date from Unix timestamp (seconds).
 *
 * @example
 * fromUnixTimestamp(1705276800);
 * // => Date('2024-01-15T00:00:00Z')
 */
export function fromUnixTimestamp(timestamp: number): Date {
  return new Date(timestamp * 1000)
}
