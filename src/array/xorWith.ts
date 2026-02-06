/**
 * Like xor, but accepts a comparator function.
 *
 * @example
 * const objects = [{ x: 1, y: 2 }, { x: 2, y: 1 }]
 * const others = [{ x: 1, y: 1 }, { x: 1, y: 2 }]
 * xorWith(isEqual, objects, others)
 * // [{ x: 2, y: 1 }, { x: 1, y: 1 }]
 */
export function xorWith<T>(
  comparator: (a: T, b: T) => boolean,
  ...arrays: readonly (readonly T[])[]
): T[] {
  const allItems: { item: T; arrayIndex: number }[] = []

  arrays.forEach((array, arrayIndex) => {
    for (const item of array) {
      // Check if item already exists in this array's items
      const existsInSameArray = allItems.some(
        (existing) =>
          existing.arrayIndex === arrayIndex && comparator(existing.item, item)
      )
      if (!existsInSameArray) {
        allItems.push({ item, arrayIndex })
      }
    }
  })

  const result: T[] = []

  for (const { item } of allItems) {
    // Count how many arrays contain this item
    let arrayCount = 0
    for (let i = 0; i < arrays.length; i++) {
      if (arrays[i]!.some((other) => comparator(item, other))) {
        arrayCount++
      }
    }

    // Only include if it appears in exactly one array
    if (arrayCount === 1) {
      // Check if already in result
      if (!result.some((existing) => comparator(existing, item))) {
        result.push(item)
      }
    }
  }

  return result
}
