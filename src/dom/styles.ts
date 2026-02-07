/**
 * Sets inline styles on an element.
 *
 * @example
 * // Set single style
 * setStyle(element, 'color', 'red');
 *
 * @example
 * // Set multiple styles
 * setStyles(element, {
 *   color: 'red',
 *   fontSize: '16px',
 *   display: 'flex'
 * });
 *
 * @example
 * // Conditional styles
 * setStyles(button, {
 *   opacity: disabled ? '0.5' : '1',
 *   cursor: disabled ? 'not-allowed' : 'pointer'
 * });
 */
export function setStyle(element: HTMLElement | null, property: string, value: string): void {
  if (!element) return
  element.style.setProperty(property, value)
}

export function setStyles(element: HTMLElement | null, styles: Partial<CSSStyleDeclaration> | Record<string, string>): void {
  if (!element) return
  Object.entries(styles).forEach(([key, value]) => {
    if (value !== undefined) {
      element.style.setProperty(key, String(value))
    }
  })
}

/**
 * Gets computed style of an element.
 *
 * @example
 * const color = getComputedStyle(element, 'color');
 * console.log(color); // => 'rgb(255, 0, 0)'
 *
 * @example
 * // Get multiple properties
 * const styles = getComputedStyles(element, ['width', 'height']);
 * console.log(styles); // => { width: '100px', height: '50px' }
 */
export function getComputedStyleValue(element: Element | null, property: string): string {
  if (!element) return ''
  return window.getComputedStyle(element).getPropertyValue(property)
}

export function getComputedStyles(element: Element | null, properties: string[]): Record<string, string> {
  if (!element) return {}
  const computed = window.getComputedStyle(element)
  const result: Record<string, string> = {}
  properties.forEach((prop) => {
    result[prop] = computed.getPropertyValue(prop)
  })
  return result
}

/**
 * Shows an element by removing display: none.
 *
 * @example
 * show(modal);
 *
 * @example
 * // Show with specific display value
 * show(element, 'flex');
 */
export function show(element: HTMLElement | null, display: string = 'block'): void {
  if (!element) return
  element.style.display = display
}

/**
 * Hides an element by setting display: none.
 *
 * @example
 * hide(modal);
 */
export function hide(element: HTMLElement | null): void {
  if (!element) return
  element.style.display = 'none'
}

/**
 * Toggles element visibility.
 *
 * @example
 * toggle(dropdown);
 *
 * @example
 * // Force show/hide
 * toggle(element, true);  // Always show
 * toggle(element, false); // Always hide
 */
export function toggle(element: HTMLElement | null, force?: boolean): void {
  if (!element) return
  const isHidden = element.style.display === 'none' || getComputedStyleValue(element, 'display') === 'none'
  const shouldShow = force !== undefined ? force : isHidden
  shouldShow ? show(element) : hide(element)
}
