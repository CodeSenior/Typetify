/**
 * Converts a string to a URL-friendly slug.
 *
 * @example
 * slugify('Hello World!') // 'hello-world'
 * slugify('Café Résumé') // 'cafe-resume'
 * slugify('  Multiple   Spaces  ') // 'multiple-spaces'
 */
export function slugify(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
