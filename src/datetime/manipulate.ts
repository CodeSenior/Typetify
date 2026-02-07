import { toDate, type DateInput } from './format'

/**
 * Duration unit type.
 */
export type DurationUnit = 'milliseconds' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years'

/**
 * Converts duration to milliseconds.
 */
function toMilliseconds(value: number, unit: DurationUnit): number {
  const multipliers: Record<DurationUnit, number> = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 60 * 1000,
    hours: 60 * 60 * 1000,
    days: 24 * 60 * 60 * 1000,
    weeks: 7 * 24 * 60 * 60 * 1000,
    months: 30 * 24 * 60 * 60 * 1000,
    years: 365 * 24 * 60 * 60 * 1000,
  }
  return value * multipliers[unit]
}

/**
 * Adds time to a date.
 *
 * @example
 * addTime(new Date('2024-01-15'), 1, 'days');
 * // => Date('2024-01-16')
 *
 * @example
 * addTime(new Date('2024-01-15'), 2, 'weeks');
 * // => Date('2024-01-29')
 *
 * @example
 * addTime(new Date('2024-01-15T10:00:00'), 30, 'minutes');
 * // => Date('2024-01-15T10:30:00')
 */
export function addTime(input: DateInput, value: number, unit: DurationUnit): Date {
  const date = toDate(input)

  if (unit === 'months') {
    const result = new Date(date)
    result.setMonth(result.getMonth() + value)
    return result
  }

  if (unit === 'years') {
    const result = new Date(date)
    result.setFullYear(result.getFullYear() + value)
    return result
  }

  return new Date(date.getTime() + toMilliseconds(value, unit))
}

/**
 * Subtracts time from a date.
 *
 * @example
 * subtractTime(new Date('2024-01-15'), 1, 'days');
 * // => Date('2024-01-14')
 */
export function subtractTime(input: DateInput, value: number, unit: DurationUnit): Date {
  return addTime(input, -value, unit)
}

/**
 * Gets the start of a time unit.
 *
 * @example
 * startOf(new Date('2024-01-15T14:30:45'), 'day');
 * // => Date('2024-01-15T00:00:00')
 *
 * @example
 * startOf(new Date('2024-01-15T14:30:45'), 'month');
 * // => Date('2024-01-01T00:00:00')
 *
 * @example
 * startOf(new Date('2024-01-15T14:30:45'), 'hour');
 * // => Date('2024-01-15T14:00:00')
 */
export function startOf(input: DateInput, unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'): Date {
  const date = toDate(input)
  const result = new Date(date)

  switch (unit) {
    case 'second':
      result.setMilliseconds(0)
      break
    case 'minute':
      result.setSeconds(0, 0)
      break
    case 'hour':
      result.setMinutes(0, 0, 0)
      break
    case 'day':
      result.setHours(0, 0, 0, 0)
      break
    case 'week':
      result.setHours(0, 0, 0, 0)
      result.setDate(result.getDate() - result.getDay())
      break
    case 'month':
      result.setHours(0, 0, 0, 0)
      result.setDate(1)
      break
    case 'year':
      result.setHours(0, 0, 0, 0)
      result.setMonth(0, 1)
      break
  }

  return result
}

/**
 * Gets the end of a time unit.
 *
 * @example
 * endOf(new Date('2024-01-15T14:30:45'), 'day');
 * // => Date('2024-01-15T23:59:59.999')
 *
 * @example
 * endOf(new Date('2024-01-15'), 'month');
 * // => Date('2024-01-31T23:59:59.999')
 */
export function endOf(input: DateInput, unit: 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'): Date {
  const date = toDate(input)
  const result = new Date(date)

  switch (unit) {
    case 'second':
      result.setMilliseconds(999)
      break
    case 'minute':
      result.setSeconds(59, 999)
      break
    case 'hour':
      result.setMinutes(59, 59, 999)
      break
    case 'day':
      result.setHours(23, 59, 59, 999)
      break
    case 'week':
      result.setHours(23, 59, 59, 999)
      result.setDate(result.getDate() + (6 - result.getDay()))
      break
    case 'month':
      result.setMonth(result.getMonth() + 1, 0)
      result.setHours(23, 59, 59, 999)
      break
    case 'year':
      result.setMonth(11, 31)
      result.setHours(23, 59, 59, 999)
      break
  }

  return result
}

/**
 * Gets the difference between two dates.
 *
 * @example
 * diff(new Date('2024-01-15'), new Date('2024-01-10'), 'days');
 * // => 5
 *
 * @example
 * diff(new Date('2024-03-01'), new Date('2024-01-01'), 'months');
 * // => 2
 */
export function diff(date1: DateInput, date2: DateInput, unit: DurationUnit): number {
  const d1 = toDate(date1)
  const d2 = toDate(date2)

  if (unit === 'months') {
    return (d1.getFullYear() - d2.getFullYear()) * 12 + (d1.getMonth() - d2.getMonth())
  }

  if (unit === 'years') {
    return d1.getFullYear() - d2.getFullYear()
  }

  const diffMs = d1.getTime() - d2.getTime()
  return Math.floor(diffMs / toMilliseconds(1, unit))
}
