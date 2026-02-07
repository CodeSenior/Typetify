/**
 * Normalizes a path, resolving '..' and '.' segments.
 *
 * @example
 * normalizePath('/home/user/../admin/./file.txt');
 * // => '/home/admin/file.txt'
 *
 * @example
 * normalizePath('src/../dist/./index.js');
 * // => 'dist/index.js'
 */
export function normalizePath(path: string): string {
  if (!path) return '.'

  const isWindows = path.includes('\\') || /^[A-Za-z]:/.test(path)
  const separator = isWindows ? '\\' : '/'

  const normalized = path.replace(/[\\/]+/g, separator)
  const isAbsolute = normalized.startsWith(separator) || /^[A-Za-z]:/.test(normalized)

  const parts = normalized.split(separator)
  const result: string[] = []

  for (const part of parts) {
    if (part === '' || part === '.') continue
    if (part === '..') {
      if (result.length > 0 && result[result.length - 1] !== '..') {
        result.pop()
      } else if (!isAbsolute) {
        result.push('..')
      }
    } else {
      result.push(part)
    }
  }

  let finalPath = result.join(separator)

  if (isAbsolute) {
    if (isWindows && /^[A-Za-z]:/.test(path)) {
      finalPath = path.slice(0, 2) + separator + finalPath
    } else {
      finalPath = separator + finalPath
    }
  }

  return finalPath || '.'
}

/**
 * Checks if a path is absolute.
 *
 * @example
 * isAbsolute('/home/user');
 * // => true
 *
 * @example
 * isAbsolute('C:\\Users');
 * // => true
 *
 * @example
 * isAbsolute('src/file.txt');
 * // => false
 */
export function isAbsolute(path: string): boolean {
  return path.startsWith('/') || path.startsWith('\\') || /^[A-Za-z]:/.test(path)
}

/**
 * Converts a path to POSIX format (forward slashes).
 *
 * @example
 * toPosix('C:\\Users\\file.txt');
 * // => 'C:/Users/file.txt'
 */
export function toPosix(path: string): string {
  return path.replace(/\\/g, '/')
}

/**
 * Converts a path to Windows format (backslashes).
 *
 * @example
 * toWindows('/home/user/file.txt');
 * // => '\\home\\user\\file.txt'
 */
export function toWindows(path: string): string {
  return path.replace(/\//g, '\\')
}

/**
 * Removes trailing slashes from a path.
 *
 * @example
 * removeTrailingSlash('/home/user/');
 * // => '/home/user'
 *
 * @example
 * removeTrailingSlash('/');
 * // => '/'
 */
export function removeTrailingSlash(path: string): string {
  if (path === '/' || path === '\\') return path
  return path.replace(/[\\/]+$/, '')
}

/**
 * Ensures a path has a trailing slash.
 *
 * @example
 * ensureTrailingSlash('/home/user');
 * // => '/home/user/'
 */
export function ensureTrailingSlash(path: string): string {
  const separator = path.includes('\\') ? '\\' : '/'
  if (path.endsWith('/') || path.endsWith('\\')) return path
  return path + separator
}

/**
 * Gets the common base path of multiple paths.
 *
 * @example
 * commonPath(['/home/user/docs', '/home/user/images', '/home/user/videos']);
 * // => '/home/user'
 *
 * @example
 * commonPath(['src/utils/a.ts', 'src/utils/b.ts', 'src/helpers/c.ts']);
 * // => 'src'
 */
export function commonPath(paths: string[]): string {
  if (paths.length === 0) return ''
  if (paths.length === 1) return paths[0]!

  const separator = paths[0]!.includes('\\') ? '\\' : '/'
  const splitPaths = paths.map((p) => p.replace(/[\\/]+/g, separator).split(separator))

  const minLength = Math.min(...splitPaths.map((p) => p.length))
  const commonParts: string[] = []

  for (let i = 0; i < minLength; i++) {
    const part = splitPaths[0]![i]
    if (splitPaths.every((p) => p[i] === part)) {
      commonParts.push(part!)
    } else {
      break
    }
  }

  return commonParts.join(separator) || ''
}
