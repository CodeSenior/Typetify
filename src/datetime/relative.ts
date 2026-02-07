import { toDate, type DateInput } from './format'

/**
 * Relative time options.
 */
export interface RelativeTimeOptions {
  locale?: string
  style?: 'long' | 'short' | 'narrow'
}

/**
 * Gets relative time string (e.g., "2 days ago", "in 3 hours").
 *
 * @example
 * timeAgo(new Date(Date.now() - 60000));
 * // => '1 minute ago'
 *
 * @example
 * timeAgo(new Date(Date.now() - 3600000));
 * // => '1 hour ago'
 *
 * @example
 * timeAgo(new Date(Date.now() + 86400000));
 * // => 'in 1 day'
 *
 * @example
 * // With French locale
 * timeAgo(new Date(Date.now() - 86400000), { locale: 'fr' });
 * // => 'il y a 1 jour'
 */
export function timeAgo(input: DateInput, options: RelativeTimeOptions = {}): string {
  const { locale = 'en', style = 'long' } = options
  const date = toDate(input)
  const now = Date.now()
  const diffMs = date.getTime() - now

  const seconds = Math.round(diffMs / 1000)
  const minutes = Math.round(diffMs / 60000)
  const hours = Math.round(diffMs / 3600000)
  const days = Math.round(diffMs / 86400000)
  const weeks = Math.round(diffMs / 604800000)
  const months = Math.round(diffMs / 2592000000)
  const years = Math.round(diffMs / 31536000000)

  const rtf = new Intl.RelativeTimeFormat(locale, { style })

  if (Math.abs(seconds) < 60) {
    return rtf.format(seconds, 'second')
  }
  if (Math.abs(minutes) < 60) {
    return rtf.format(minutes, 'minute')
  }
  if (Math.abs(hours) < 24) {
    return rtf.format(hours, 'hour')
  }
  if (Math.abs(days) < 7) {
    return rtf.format(days, 'day')
  }
  if (Math.abs(weeks) < 4) {
    return rtf.format(weeks, 'week')
  }
  if (Math.abs(months) < 12) {
    return rtf.format(months, 'month')
  }
  return rtf.format(years, 'year')
}

/**
 * Gets a human-readable duration string.
 *
 * @example
 * formatDuration(3661000);
 * // => '1h 1m 1s'
 *
 * @example
 * formatDuration(86400000);
 * // => '1d'
 *
 * @example
 * formatDuration(90061000);
 * // => '1d 1h 1m 1s'
 */
export function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  const parts: string[] = []

  if (days > 0) parts.push(`${days}d`)
  if (hours % 24 > 0) parts.push(`${hours % 24}h`)
  if (minutes % 60 > 0) parts.push(`${minutes % 60}m`)
  if (seconds % 60 > 0 || parts.length === 0) parts.push(`${seconds % 60}s`)

  return parts.join(' ')
}

/**
 * Parses a duration string to milliseconds.
 *
 * @example
 * parseDuration('1h 30m');
 * // => 5400000
 *
 * @example
 * parseDuration('2d 12h');
 * // => 216000000
 */
export function parseDuration(duration: string): number {
  const units: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
    w: 7 * 24 * 60 * 60 * 1000,
  }

  let total = 0
  const regex = /(\d+)\s*(ms|s|m|h|d|w)/gi
  let match

  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1]!, 10)
    const unit = match[2]!.toLowerCase()
    total += value * (units[unit] ?? 0)
  }

  return total
}
