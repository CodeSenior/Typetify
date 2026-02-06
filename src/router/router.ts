/**
 * Type-Safe Router - Routes with typed parameters
 */

type ParamType = 'string' | 'number' | 'boolean'

interface RouteParams {
  [key: string]: ParamType
}

type InferParamType<T extends ParamType> = 
  T extends 'string' ? string :
  T extends 'number' ? number :
  T extends 'boolean' ? boolean :
  never

type InferParams<T extends RouteParams> = {
  [K in keyof T]: InferParamType<T[K]>
}

export interface Route<Params extends RouteParams = Record<string, never>> {
  path: string
  params: Params
  build: (params: InferParams<Params>) => string
  match: (path: string) => InferParams<Params> | null
}

/**
 * Creates a type-safe route definition.
 * 
 * @example
 * const userRoute = route('/users/:id', { id: 'string' })
 * 
 * // Build URL (type-checked!)
 * userRoute.build({ id: '123' }) // '/users/123'
 * 
 * // Match URL
 * userRoute.match('/users/123') // { id: '123' }
 * userRoute.match('/posts/123') // null
 */
export function route<Params extends RouteParams = Record<string, never>>(
  path: string,
  params?: Params
): Route<Params> {
  const paramNames = (path.match(/:(\w+)/g) || []).map(p => p.slice(1))
  const paramDefs = params || ({} as Params)

  const build = (values: InferParams<Params>): string => {
    let result = path
    for (const name of paramNames) {
      const value = (values as Record<string, unknown>)[name]
      result = result.replace(`:${name}`, String(value))
    }
    return result
  }

  const match = (testPath: string): InferParams<Params> | null => {
    const pattern = path.replace(/:(\w+)/g, '([^/]+)')
    const regex = new RegExp(`^${pattern}$`)
    const matches = testPath.match(regex)

    if (!matches) return null

    const result: Record<string, unknown> = {}
    paramNames.forEach((name, index) => {
      const value = matches[index + 1]
      const type = paramDefs[name as keyof Params]
      
      if (type === 'number') {
        result[name] = Number(value)
      } else if (type === 'boolean') {
        result[name] = value === 'true'
      } else {
        result[name] = value
      }
    })

    return result as InferParams<Params>
  }

  return { path, params: paramDefs, build, match }
}

export interface Router<Routes extends Record<string, Route<RouteParams>>> {
  routes: Routes
  navigate: <K extends keyof Routes>(
    name: K,
    params: Routes[K] extends Route<infer P> ? InferParams<P> : never
  ) => string
  match: (path: string) => { name: keyof Routes; params: Record<string, unknown> } | null
}

/**
 * Creates a type-safe router with named routes.
 * 
 * @example
 * const router = createRouter({
 *   home: route('/'),
 *   users: route('/users'),
 *   user: route('/users/:id', { id: 'string' }),
 *   post: route('/posts/:postId/comments/:commentId', { 
 *     postId: 'number', 
 *     commentId: 'number' 
 *   }),
 * })
 * 
 * // Navigate (fully typed!)
 * router.navigate('user', { id: '123' }) // '/users/123'
 * router.navigate('post', { postId: 1, commentId: 5 }) // '/posts/1/comments/5'
 * 
 * // TypeScript error: missing 'id'
 * router.navigate('user', {})
 * 
 * // Match current path
 * const matched = router.match('/users/123')
 * // { name: 'user', params: { id: '123' } }
 */
export function createRouter<Routes extends Record<string, Route<RouteParams>>>(
  routes: Routes
): Router<Routes> {
  return {
    routes,
    
    navigate(name, params) {
      const routeDef = routes[name]
      if (!routeDef) throw new Error(`Route not found: ${String(name)}`)
      return routeDef.build(params as InferParams<RouteParams>)
    },

    match(path) {
      for (const [name, routeDef] of Object.entries(routes)) {
        const params = routeDef.match(path)
        if (params) {
          return { name: name as keyof Routes, params }
        }
      }
      return null
    },
  }
}
