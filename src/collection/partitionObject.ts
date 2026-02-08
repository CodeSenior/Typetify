/**
 * Splits an object into two objects based on a predicate.
 * First object contains entries that pass, second contains entries that fail.
 *
 * @example
 * const data = { apple: 'fruit', carrot: 'vegetable', banana: 'fruit', broccoli: 'vegetable' }
 * const [fruits, vegetables] = partitionObject(data, (value) => value === 'fruit')
 * // fruits: { apple: 'fruit', banana: 'fruit' }
 * // vegetables: { carrot: 'vegetable', broccoli: 'vegetable' }
 *
 * @example
 * const users = {
 *   user1: { name: 'Alice', active: true },
 *   user2: { name: 'Bob', active: false },
 *   user3: { name: 'Charlie', active: true }
 * }
 * const [active, inactive] = partitionObject(users, (user) => user.active)
 * // active: { user1: { name: 'Alice', active: true }, user3: { name: 'Charlie', active: true } }
 * // inactive: { user2: { name: 'Bob', active: false } }
 *
 * @example
 * const scores = { math: 85, english: 92, science: 78, history: 95 }
 * const [highScores, lowScores] = partitionObject(scores, (score) => score >= 90)
 * // highScores: { english: 92, history: 95 }
 * // lowScores: { math: 85, science: 78 }
 *
 * @example
 * // Using key and value in predicate
 * const items = { item1: 10, item2: 20, item3: 5 }
 * const [expensive, cheap] = partitionObject(
 *   items,
 *   (value, key) => value > 15,
 * )
 * // expensive: { item2: 20 }
 * // cheap: { item1: 10, item3: 5 }
 */
export function partitionObject<T extends Record<PropertyKey, any>>(
  obj: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean
): [Partial<T>, Partial<T>] {
  const pass: Partial<T> = {}
  const fail: Partial<T> = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key]
      if (predicate(value, key)) {
        pass[key] = value
      } else {
        fail[key] = value
      }
    }
  }

  return [pass, fail]
}
