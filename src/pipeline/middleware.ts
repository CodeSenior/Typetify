/**
 * Middleware Pipeline - Express-style middleware with type safety
 */

export type NextFunction = () => Promise<void> | void
export type Middleware<Context> = (ctx: Context, next: NextFunction) => Promise<void> | void

export interface MiddlewarePipeline<Context> {
  /** Add a middleware to the pipeline */
  use(middleware: Middleware<Context>): MiddlewarePipeline<Context>
  /** Execute the pipeline with a context */
  execute(ctx: Context): Promise<void>
  /** Create a handler that executes the pipeline */
  handler(): (ctx: Context) => Promise<void>
}

/**
 * Creates a middleware pipeline for processing requests or data.
 * 
 * @example
 * interface RequestContext {
 *   user?: User
 *   body: unknown
 *   headers: Record<string, string>
 * }
 * 
 * const pipeline = createMiddleware<RequestContext>()
 *   .use(async (ctx, next) => {
 *     // Authentication
 *     const token = ctx.headers['authorization']
 *     ctx.user = await validateToken(token)
 *     await next()
 *   })
 *   .use(async (ctx, next) => {
 *     // Logging
 *     console.log('Request from:', ctx.user?.id)
 *     await next()
 *     console.log('Request completed')
 *   })
 *   .use(async (ctx, next) => {
 *     // Rate limiting
 *     await checkRateLimit(ctx.user?.id)
 *     await next()
 *   })
 * 
 * // Execute the pipeline
 * await pipeline.execute({
 *   body: { name: 'John' },
 *   headers: { authorization: 'Bearer ...' }
 * })
 */
export function createMiddleware<Context>(): MiddlewarePipeline<Context> {
  const middlewares: Middleware<Context>[] = []

  const pipeline: MiddlewarePipeline<Context> = {
    use(middleware: Middleware<Context>): MiddlewarePipeline<Context> {
      middlewares.push(middleware)
      return pipeline
    },

    async execute(ctx: Context): Promise<void> {
      let index = 0

      const next: NextFunction = async () => {
        if (index < middlewares.length) {
          const middleware = middlewares[index++]!
          await middleware(ctx, next)
        }
      }

      await next()
    },

    handler(): (ctx: Context) => Promise<void> {
      return (ctx: Context) => pipeline.execute(ctx)
    },
  }

  return pipeline
}

/**
 * Composes multiple middlewares into a single middleware.
 * 
 * @example
 * const authMiddleware = compose(
 *   validateToken,
 *   checkPermissions,
 *   loadUser
 * )
 * 
 * pipeline.use(authMiddleware)
 */
export function compose<Context>(
  ...middlewares: Middleware<Context>[]
): Middleware<Context> {
  return async (ctx: Context, next: NextFunction) => {
    let index = 0

    const dispatch = async (): Promise<void> => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++]!
        await middleware(ctx, dispatch)
      } else {
        await next()
      }
    }

    await dispatch()
  }
}
