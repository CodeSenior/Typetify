type MatchCase<T, R> = {
  when: (value: T) => boolean
  then: (value: T) => R
}

type MatchBuilder<T, R> = {
  with: (
    predicate: (value: T) => boolean,
    handler: (value: T) => R
  ) => MatchBuilder<T, R>
  otherwise: (handler: (value: T) => R) => (value: T) => R
  run: (value: T) => R | undefined
}

/**
 * Pattern matching helper. Chain .with() for cases and .otherwise() for default.
 *
 * @example
 * const getDiscount = match<number, string>()
 *   .with(n => n >= 100, () => '20% off')
 *   .with(n => n >= 50, () => '10% off')
 *   .otherwise(() => 'No discount')
 *
 * getDiscount(150) // '20% off'
 * getDiscount(75) // '10% off'
 * getDiscount(25) // 'No discount'
 */
export function match<T, R = T>(): MatchBuilder<T, R> {
  const cases: MatchCase<T, R>[] = []

  const builder: MatchBuilder<T, R> = {
    with(predicate, handler) {
      cases.push({ when: predicate, then: handler })
      return builder
    },

    otherwise(handler) {
      return (value: T): R => {
        for (const c of cases) {
          if (c.when(value)) {
            return c.then(value)
          }
        }
        return handler(value)
      }
    },

    run(value: T): R | undefined {
      for (const c of cases) {
        if (c.when(value)) {
          return c.then(value)
        }
      }
      return undefined
    },
  }

  return builder
}
