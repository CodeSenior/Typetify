export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const levelPriority: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

let currentLevel: LogLevel = 'info'

/**
 * Sets the minimum log level.
 *
 * @example
 * setLogLevel('debug') // Show all logs
 * setLogLevel('error') // Only show errors
 */
export function setLogLevel(level: LogLevel): void {
  currentLevel = level
}

/**
 * Gets the current log level.
 */
export function getLogLevel(): LogLevel {
  return currentLevel
}

function shouldLog(level: LogLevel): boolean {
  return levelPriority[level] >= levelPriority[currentLevel]
}

/**
 * Simple logger with levels.
 *
 * @example
 * log.debug('Detailed info')
 * log.info('General info')
 * log.warn('Warning')
 * log.error('Error occurred')
 */
export const log = {
  debug(message: string, ...args: unknown[]): void {
    if (shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args)
    }
  },

  info(message: string, ...args: unknown[]): void {
    if (shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args)
    }
  },

  warn(message: string, ...args: unknown[]): void {
    if (shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args)
    }
  },

  error(message: string, ...args: unknown[]): void {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args)
    }
  },
}
