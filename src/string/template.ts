/**
 * Simple template string interpolation.
 * Replaces {{key}} with values from the vars object.
 *
 * @example
 * template('Hello {{name}}!', { name: 'World' }) // 'Hello World!'
 * template('{{a}} + {{b}} = {{c}}', { a: 1, b: 2, c: 3 }) // '1 + 2 = 3'
 */
export function template(
  str: string,
  vars: Record<string, unknown>
): string {
  return str.replace(/\{\{(\w+)\}\}/g, (_, key: string) => {
    return key in vars ? String(vars[key]) : `{{${key}}}`
  })
}
