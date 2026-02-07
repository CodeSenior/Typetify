/**
 * Joins path segments together.
 *
 * @example
 * joinPath('/home', 'user', 'file.txt');
 * // => '/home/user/file.txt'
 *
 * @example
 * joinPath('api', 'v1', 'users');
 * // => 'api/v1/users'
 *
 * @example
 * joinPath('/home/', '/user/', '/file.txt');
 * // => '/home/user/file.txt'
 */
export function joinPath(...segments: string[]): string {
  if (segments.length === 0) return '.'

  // Detect if any segment uses Windows-style paths
  const isWindows = segments.some((s) => s.includes('\\') || /^[A-Za-z]:/.test(s))
  const separator = isWindows ? '\\' : '/'

  const parts: string[] = []

  for (const segment of segments) {
    if (!segment) continue

    // Normalize separators
    const normalized = segment.replace(/[\\/]+/g, separator)

    // Split and add non-empty parts
    const segmentParts = normalized.split(separator).filter(Boolean)
    parts.push(...segmentParts)
  }

  // Preserve leading separator
  const firstSegment = segments[0] ?? ''
  const hasLeadingSep = firstSegment.startsWith('/') || firstSegment.startsWith('\\')
  const hasWindowsRoot = /^[A-Za-z]:/.test(firstSegment)

  let result = parts.join(separator)

  if (hasWindowsRoot) {
    result = firstSegment.slice(0, 2) + separator + result.slice(result.indexOf(separator) + 1 || result.length)
  } else if (hasLeadingSep) {
    result = separator + result
  }

  return result || '.'
}

/**
 * Resolves a sequence of paths to an absolute path.
 *
 * @example
 * resolvePath('/home/user', '../admin', 'file.txt');
 * // => '/home/admin/file.txt'
 *
 * @example
 * resolvePath('src', '..', 'dist', 'index.js');
 * // => '/current/working/dir/dist/index.js' (relative to cwd)
 */
export function resolvePath(...segments: string[]): string {
  const isWindows = segments.some((s) => s.includes('\\') || /^[A-Za-z]:/.test(s))
  const separator = isWindows ? '\\' : '/'

  const resolvedParts: string[] = []
  let hasRoot = false

  for (const segment of segments) {
    if (!segment) continue

    const normalized = segment.replace(/[\\/]+/g, separator)
    const parts = normalized.split(separator)

    // Check if this segment is absolute
    const isAbsolute = normalized.startsWith(separator) || /^[A-Za-z]:/.test(normalized)

    if (isAbsolute) {
      resolvedParts.length = 0
      hasRoot = true
    }

    for (const part of parts) {
      if (part === '' || part === '.') continue
      if (part === '..') {
        resolvedParts.pop()
      } else {
        resolvedParts.push(part)
      }
    }
  }

  const result = resolvedParts.join(separator)
  return hasRoot ? separator + result : result || '.'
}

/**
 * Gets the relative path from one path to another.
 *
 * @example
 * relativePath('/home/user/docs', '/home/user/images');
 * // => '../images'
 *
 * @example
 * relativePath('/home/user', '/home/user/docs/file.txt');
 * // => 'docs/file.txt'
 */
export function relativePath(from: string, to: string): string {
  const separator = from.includes('\\') || to.includes('\\') ? '\\' : '/'

  const fromParts = from.replace(/[\\/]+/g, separator).split(separator).filter(Boolean)
  const toParts = to.replace(/[\\/]+/g, separator).split(separator).filter(Boolean)

  // Find common prefix
  let commonLength = 0
  const minLength = Math.min(fromParts.length, toParts.length)

  for (let i = 0; i < minLength; i++) {
    if (fromParts[i] === toParts[i]) {
      commonLength++
    } else {
      break
    }
  }

  // Build relative path
  const upCount = fromParts.length - commonLength
  const downParts = toParts.slice(commonLength)

  const relativeParts = [...Array(upCount).fill('..'), ...downParts]

  return relativeParts.join(separator) || '.'
}
