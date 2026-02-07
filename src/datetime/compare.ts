import { toDate, type DateInput } from './format'

/**
 * Checks if a date is before another date.
 *
 * @example
 * isBefore(new Date('2024-01-10'), new Date('2024-01-15'));
 * // => true
 */
export function isBefore(date1: DateInput, date2: DateInput): boolean {
  return toDate(date1).getTime() < toDate(date2).getTime()
}

/**
 * Checks if a date is after another date.
 *
 * @example
 * isAfter(new Date('2024-01-15'), new Date('2024-01-10'));
 * // => true
 */
export function isAfter(date1: DateInput, date2: DateInput): boolean {
  return toDate(date1).getTime() > toDate(date2).getTime()
}

/**
 * Checks if two dates are the same.
 *
 * @example
 * isSameDate(new Date('2024-01-15'), new Date('2024-01-15'));
 * // => true
 */
export function isSameDate(date1: DateInput, date2: DateInput): boolean {
  return toDate(date1).getTime() === toDate(date2).getTime()
}

/**
 * Checks if two dates are on the same day.
 *
 * @example
 * isSameDay(new Date('2024-01-15T10:00'), new Date('2024-01-15T20:00'));
 * // => true
 */
export function isSameDay(date1: DateInput, date2: DateInput): boolean {
  const d1 = toDate(date1)
  const d2 = toDate(date2)
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  )
}

/**
 * Checks if a date is between two dates.
 *
 * @example
 * isBetween(new Date('2024-01-15'), new Date('2024-01-10'), new Date('2024-01-20'));
 * // => true
 */
export function isBetween(date: DateInput, start: DateInput, end: DateInput): boolean {
  const d = toDate(date).getTime()
  return d >= toDate(start).getTime() && d <= toDate(end).getTime()
}

/**
 * Checks if a date is today.
 *
 * @example
 * isToday(new Date());
 * // => true
 */
export function isToday(input: DateInput): boolean {
  return isSameDay(input, new Date())
}

/**
 * Checks if a date is yesterday.
 *
 * @example
 * isYesterday(new Date(Date.now() - 86400000));
 * // => true
 */
export function isYesterday(input: DateInput): boolean {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return isSameDay(input, yesterday)
}

/**
 * Checks if a date is tomorrow.
 *
 * @example
 * isTomorrow(new Date(Date.now() + 86400000));
 * // => true
 */
export function isTomorrow(input: DateInput): boolean {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return isSameDay(input, tomorrow)
}

/**
 * Checks if a date is in the past.
 *
 * @example
 * isPast(new Date('2020-01-01'));
 * // => true
 */
export function isPast(input: DateInput): boolean {
  return toDate(input).getTime() < Date.now()
}

/**
 * Checks if a date is in the future.
 *
 * @example
 * isFuture(new Date('2030-01-01'));
 * // => true
 */
export function isFuture(input: DateInput): boolean {
  return toDate(input).getTime() > Date.now()
}

/**
 * Checks if a year is a leap year.
 *
 * @example
 * isLeapYear(2024);
 * // => true
 *
 * @example
 * isLeapYear(2023);
 * // => false
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Checks if a date is a weekend (Saturday or Sunday).
 *
 * @example
 * isWeekend(new Date('2024-01-13')); // Saturday
 * // => true
 */
export function isWeekend(input: DateInput): boolean {
  const day = toDate(input).getDay()
  return day === 0 || day === 6
}

/**
 * Checks if a date is a weekday (Monday to Friday).
 *
 * @example
 * isWeekday(new Date('2024-01-15')); // Monday
 * // => true
 */
export function isWeekday(input: DateInput): boolean {
  return !isWeekend(input)
}
