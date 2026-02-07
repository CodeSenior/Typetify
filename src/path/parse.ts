/**
 * Parsed path components.
 */
export interface ParsedPath {
  root: string
  dir: string
  base: string
  ext: string
  name: string
}

/**
 * Parses a path into its components.
 *
 * @example
 * parsePath('/home/user/file.txt');
 * // => { root: '/', dir: '/home/user', base: 'file.txt', ext: '.txt', name: 'file' }
 *
 * @example
 * parsePath('C:\\Users\\file.txt');
 * // => { root: 'C:\\', dir: 'C:\\Users', base: 'file.txt', ext: '.txt', name: 'file' }
 */
export function parsePath(path: string): ParsedPath {
  const isWindows = path.includes('\\') || /^[A-Za-z]:/.test(path)
  const separator = isWindows ? '\\' : '/'

  // Normalize path
  const normalizedPath = path.replace(/\\/g, separator).replace(/\//g, separator)

  // Extract root
  let root = ''
  if (isWindows && /^[A-Za-z]:/.test(normalizedPath)) {
    root = normalizedPath.slice(0, 3)
  } else if (normalizedPath.startsWith(separator)) {
    root = separator
  }

  // Extract base (filename with extension)
  const lastSepIndex = normalizedPath.lastIndexOf(separator)
  const base = lastSepIndex === -1 ? normalizedPath : normalizedPath.slice(lastSepIndex + 1)

  // Extract dir
  const dir = lastSepIndex === -1 ? '' : normalizedPath.slice(0, lastSepIndex) || root

  // Extract extension and name
  const lastDotIndex = base.lastIndexOf('.')
  const ext = lastDotIndex > 0 ? base.slice(lastDotIndex) : ''
  const name = lastDotIndex > 0 ? base.slice(0, lastDotIndex) : base

  return { root, dir, base, ext, name }
}

/**
 * Gets the directory name of a path.
 *
 * @example
 * dirname('/home/user/file.txt');
 * // => '/home/user'
 *
 * @example
 * dirname('file.txt');
 * // => '.'
 */
export function dirname(path: string): string {
  const parsed = parsePath(path)
  return parsed.dir || '.'
}

/**
 * Gets the base name of a path.
 *
 * @example
 * basename('/home/user/file.txt');
 * // => 'file.txt'
 *
 * @example
 * basename('/home/user/file.txt', '.txt');
 * // => 'file'
 */
export function basename(path: string, ext?: string): string {
  const parsed = parsePath(path)
  if (ext && parsed.base.endsWith(ext)) {
    return parsed.base.slice(0, -ext.length)
  }
  return parsed.base
}

/**
 * Gets the extension of a path.
 *
 * @example
 * extname('/home/user/file.txt');
 * // => '.txt'
 *
 * @example
 * extname('file');
 * // => ''
 */
export function extname(path: string): string {
  return parsePath(path).ext
}
