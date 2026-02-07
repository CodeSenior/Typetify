/**
 * Type-safe querySelector that returns the correct element type.
 *
 * @example
 * // Get a button with proper typing
 * const button = querySelector<HTMLButtonElement>('#submit');
 * if (button) {
 *   button.disabled = true;
 * }
 *
 * @example
 * // Get an input element
 * const input = querySelector<HTMLInputElement>('input[name="email"]');
 * if (input) {
 *   console.log(input.value);
 * }
 *
 * @example
 * // Returns null if not found
 * const missing = querySelector('#nonexistent');
 * // => null
 */
export function querySelector<T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): T | null {
  return parent.querySelector<T>(selector)
}

/**
 * Type-safe querySelectorAll that returns an array of elements.
 *
 * @example
 * // Get all buttons
 * const buttons = querySelectorAll<HTMLButtonElement>('button');
 * buttons.forEach(btn => btn.disabled = true);
 *
 * @example
 * // Get all list items
 * const items = querySelectorAll<HTMLLIElement>('ul > li');
 * console.log(items.length);
 *
 * @example
 * // Search within a specific element
 * const container = querySelector('#container');
 * if (container) {
 *   const links = querySelectorAll<HTMLAnchorElement>('a', container);
 * }
 */
export function querySelectorAll<T extends Element = Element>(
  selector: string,
  parent: Document | Element = document
): T[] {
  return Array.from(parent.querySelectorAll<T>(selector))
}
