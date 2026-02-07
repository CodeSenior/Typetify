/**
 * Checks if an element is visible in the viewport.
 *
 * @example
 * // Check if element is visible
 * if (isInViewport(element)) {
 *   lazyLoadImage(element);
 * }
 *
 * @example
 * // Partial visibility
 * if (isInViewport(element, 0.5)) {
 *   // At least 50% visible
 *   triggerAnimation(element);
 * }
 *
 * @example
 * // Lazy loading images
 * const images = querySelectorAll<HTMLImageElement>('img[data-src]');
 * images.forEach(img => {
 *   if (isInViewport(img)) {
 *     img.src = img.dataset.src!;
 *   }
 * });
 */
export function isInViewport(element: Element | null, threshold: number = 0): boolean {
  if (!element) return false

  const rect = element.getBoundingClientRect()
  const windowHeight = window.innerHeight || document.documentElement.clientHeight
  const windowWidth = window.innerWidth || document.documentElement.clientWidth

  const vertInView = rect.top <= windowHeight && rect.top + rect.height * threshold >= 0
  const horInView = rect.left <= windowWidth && rect.left + rect.width * threshold >= 0

  return vertInView && horInView
}

/**
 * Gets the bounding rectangle of an element.
 *
 * @example
 * const rect = getRect(element);
 * console.log(rect.top, rect.left, rect.width, rect.height);
 *
 * @example
 * // Position tooltip relative to button
 * const buttonRect = getRect(button);
 * tooltip.style.top = `${buttonRect.bottom + 10}px`;
 * tooltip.style.left = `${buttonRect.left}px`;
 */
export function getRect(element: Element | null): DOMRect | null {
  if (!element) return null
  return element.getBoundingClientRect()
}

/**
 * Scrolls an element into view smoothly.
 *
 * @example
 * // Scroll to element
 * scrollIntoView(element);
 *
 * @example
 * // Scroll to top of page
 * scrollIntoView(document.body, 'start');
 *
 * @example
 * // Scroll element to center
 * scrollIntoView(element, 'center');
 */
export function scrollIntoView(
  element: Element | null,
  block: ScrollLogicalPosition = 'start',
  behavior: ScrollBehavior = 'smooth'
): void {
  if (!element) return
  element.scrollIntoView({ behavior, block })
}

/**
 * Scrolls to a specific position.
 *
 * @example
 * // Scroll to top
 * scrollTo(0, 0);
 *
 * @example
 * // Scroll down 500px
 * scrollTo(0, 500, 'smooth');
 *
 * @example
 * // Scroll to bottom
 * scrollTo(0, document.body.scrollHeight);
 */
export function scrollTo(x: number, y: number, behavior: ScrollBehavior = 'smooth'): void {
  window.scrollTo({ left: x, top: y, behavior })
}

/**
 * Gets the scroll position of the window.
 *
 * @example
 * const { x, y } = getScrollPosition();
 * console.log(`Scrolled ${y}px from top`);
 *
 * @example
 * // Save scroll position
 * const position = getScrollPosition();
 * // Later: scrollTo(position.x, position.y);
 */
export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop,
  }
}
