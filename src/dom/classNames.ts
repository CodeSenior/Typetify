type ClassValue = string | number | boolean | undefined | null | ClassValue[] | Record<string, boolean | undefined | null>

/**
 * Combines class names conditionally (like clsx/classnames).
 *
 * @example
 * // Simple strings
 * classNames('btn', 'btn-primary');
 * // => 'btn btn-primary'
 *
 * @example
 * // Conditional classes
 * classNames('btn', { 'btn-primary': isPrimary, 'btn-disabled': disabled });
 * // => 'btn btn-primary' (if isPrimary=true, disabled=false)
 *
 * @example
 * // Mixed with arrays
 * classNames('btn', ['btn-lg', disabled && 'btn-disabled']);
 * // => 'btn btn-lg btn-disabled' (if disabled=true)
 *
 * @example
 * // Real-world React example
 * function Button({ variant, disabled, className }: ButtonProps) {
 *   return (
 *     <button
 *       className={classNames(
 *         'btn',
 *         `btn-${variant}`,
 *         { 'btn-disabled': disabled },
 *         className
 *       )}
 *     />
 *   );
 * }
 *
 * @example
 * // Falsy values are ignored
 * classNames('btn', null, undefined, false, '', 'active');
 * // => 'btn active'
 */
export function classNames(...classes: ClassValue[]): string {
  const result: string[] = []

  for (const cls of classes) {
    if (!cls) continue

    if (typeof cls === 'string' || typeof cls === 'number') {
      result.push(String(cls))
    } else if (Array.isArray(cls)) {
      const nested = classNames(...cls)
      if (nested) result.push(nested)
    } else if (typeof cls === 'object') {
      for (const [key, value] of Object.entries(cls)) {
        if (value) result.push(key)
      }
    }
  }

  return result.join(' ')
}

/**
 * Adds a class to an element.
 *
 * @example
 * const button = querySelector('#submit');
 * addClass(button, 'active');
 *
 * @example
 * // Add multiple classes
 * addClass(element, 'btn', 'btn-primary', 'btn-lg');
 */
export function addClass(element: Element | null, ...classes: string[]): void {
  if (!element) return
  element.classList.add(...classes)
}

/**
 * Removes a class from an element.
 *
 * @example
 * removeClass(button, 'active');
 *
 * @example
 * // Remove multiple classes
 * removeClass(element, 'btn-primary', 'btn-lg');
 */
export function removeClass(element: Element | null, ...classes: string[]): void {
  if (!element) return
  element.classList.remove(...classes)
}

/**
 * Toggles a class on an element.
 *
 * @example
 * // Toggle a class
 * toggleClass(button, 'active');
 *
 * @example
 * // Force add or remove
 * toggleClass(button, 'active', true);  // Always add
 * toggleClass(button, 'active', false); // Always remove
 */
export function toggleClass(element: Element | null, className: string, force?: boolean): boolean {
  if (!element) return false
  return element.classList.toggle(className, force)
}

/**
 * Checks if an element has a class.
 *
 * @example
 * if (hasClass(button, 'active')) {
 *   console.log('Button is active');
 * }
 */
export function hasClass(element: Element | null, className: string): boolean {
  if (!element) return false
  return element.classList.contains(className)
}
