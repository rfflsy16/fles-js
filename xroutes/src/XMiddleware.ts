import type { Request, Response, NextFunction } from 'express'

type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<void> | void

interface MethodMiddleware {
    GET?: MiddlewareFunction[]
    POST?: MiddlewareFunction[]
    PUT?: MiddlewareFunction[]
    DELETE?: MiddlewareFunction[]
    PATCH?: MiddlewareFunction[]
}

interface MiddlewareConfig {
    global?: MiddlewareFunction[]
    routes?: {
        [path: string]: MiddlewareFunction[] | MethodMiddleware
    }
}

class XMiddleware {
    private static middlewareConfig: MiddlewareConfig = {}

    static setup(config: MiddlewareConfig) {
        this.middlewareConfig = config
    }

    static getMiddleware(path: string, method: string): MiddlewareFunction[] {
        const middleware: MiddlewareFunction[] = []

        // Add global middleware
        if (this.middlewareConfig.global) {
            middleware.push(...this.middlewareConfig.global)
        }

        // Add route specific middleware
        if (this.middlewareConfig.routes) {
            Object.entries(this.middlewareConfig.routes).forEach(([routePath, routeMiddleware]) => {
                if (this.matchPath(path, routePath)) {
                    if (Array.isArray(routeMiddleware)) {
                        middleware.push(...routeMiddleware)
                    } else {
                        const methodMiddleware = routeMiddleware[method as keyof MethodMiddleware]
                        if (methodMiddleware) {
                            middleware.push(...methodMiddleware)
                        }
                    }
                }
            })
        }

        return middleware
    }

    private static matchPath(path: string, pattern: string): boolean {
        if (pattern.endsWith('*')) {
            const prefix = pattern.slice(0, -1)
            return path.startsWith(prefix)
        }
        return path === pattern
    }
}

export default XMiddleware