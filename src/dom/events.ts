/**
 * Adds an event listener with automatic cleanup.
 *
 * @example
 * // Basic usage
 * const cleanup = addEventListener(button, 'click', () => {
 *   console.log('Clicked!');
 * });
 * // Later: cleanup();
 *
 * @example
 * // With options
 * addEventListener(window, 'scroll', handleScroll, { passive: true });
 *
 * @example
 * // Multiple events
 * const cleanups = [
 *   addEventListener(input, 'focus', handleFocus),
 *   addEventListener(input, 'blur', handleBlur)
 * ];
 * // Cleanup all: cleanups.forEach(fn => fn());
 */
export function addEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Window | Document | null,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  options?: AddEventListenerOptions
): () => void {
  if (!element) return () => {}

  element.addEventListener(event as string, handler as EventListener, options)

  return () => {
    element.removeEventListener(event as string, handler as EventListener, options)
  }
}

/**
 * Adds an event listener that fires only once.
 *
 * @example
 * // Listen for one click
 * once(button, 'click', () => {
 *   console.log('Clicked once!');
 * });
 *
 * @example
 * // Wait for image load
 * once(image, 'load', () => {
 *   console.log('Image loaded');
 * });
 */
export function once<K extends keyof HTMLElementEventMap>(
  element: HTMLElement | Window | Document | null,
  event: K,
  handler: (event: HTMLElementEventMap[K]) => void
): () => void {
  if (!element) return () => {}

  const wrappedHandler = (e: Event) => {
    handler(e as HTMLElementEventMap[K])
    element.removeEventListener(event as string, wrappedHandler)
  }

  element.addEventListener(event as string, wrappedHandler)

  return () => {
    element.removeEventListener(event as string, wrappedHandler)
  }
}

/**
 * Event delegation - attach handler to parent that fires for matching children.
 *
 * @example
 * // Handle clicks on any button inside container
 * delegate(container, 'button', 'click', (event, target) => {
 *   console.log('Button clicked:', target);
 * });
 *
 * @example
 * // Handle dynamic list items
 * delegate(list, '.item', 'click', (event, item) => {
 *   item.classList.toggle('selected');
 * });
 *
 * @example
 * // Works with dynamically added elements
 * const cleanup = delegate(document.body, '[data-action]', 'click', (e, el) => {
 *   const action = el.getAttribute('data-action');
 *   handleAction(action);
 * });
 */
export function delegate<T extends HTMLElement = HTMLElement>(
  parent: HTMLElement | Document,
  selector: string,
  event: string,
  handler: (event: Event, target: T) => void
): () => void {
  const wrappedHandler = (e: Event) => {
    const target = (e.target as HTMLElement).closest(selector) as T | null
    if (target && parent.contains(target)) {
      handler(e, target)
    }
  }

  parent.addEventListener(event, wrappedHandler)

  return () => {
    parent.removeEventListener(event, wrappedHandler)
  }
}
