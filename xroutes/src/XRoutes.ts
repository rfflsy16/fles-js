import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import type { Request, Response } from 'express'
import XMiddleware from './XMiddleware'

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch'
type RouteHandler = (req: Request, res: Response) => void

class XRoutes {
    private static router = Router()
    private static app: any

    static async createServer(app: any, options?: { dir?: string }) {
        this.app = app
        const routesPath = path.join(process.cwd(), options?.dir || '', 'routes')
        
        if (!fs.existsSync(routesPath)) {
            throw new Error(`❌ Directory "routes" not found in ${options?.dir || 'root'}!`)
        }

        await this.watchRoutes(routesPath)
        
        // Add error handler if exists
        const errorHandlerPath = path.join(process.cwd(), options?.dir || '', 'errorHandler.ts')
        if (fs.existsSync(errorHandlerPath)) {
            const { errorHandler } = await import(`file://${errorHandlerPath}`)
            app.use(errorHandler)
        }

        return app
    }

    private static async watchRoutes(directory: string) {
        this.app.use(await this.loadRoutes(directory))

        chokidar.watch(directory, {
            ignored: /(^|[\/\\])\../,
            persistent: true,
            ignoreInitial: true
        }).on('all', async () => {
            try {
                this.router = Router()
                this.clearRouteCache(directory)
                const newRouter = await this.loadRoutes(directory)
                this.updateAppRouter(newRouter)
            } catch {
                const newRouter = await this.loadRoutes(directory)
                this.updateAppRouter(newRouter)
            }
        })
    }

    private static clearRouteCache(directory: string) {
        Object.keys(require.cache)
            .filter(key => key.includes(directory))
            .forEach(key => delete require.cache[key])
    }

    private static updateAppRouter(newRouter: Router) {
        if (this.app) {
            this.app._router.stack = this.app._router.stack.filter(
                (layer: any) => layer.name !== 'router'
            )
            this.app.use(newRouter)
        }
    }

    private static async loadRoutes(directory: string, currentPath = ''): Promise<Router> {
        const entries = await fs.promises.readdir(directory, { withFileTypes: true })

        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name)
            
            if (entry.isDirectory()) {
                const routePath = entry.name.startsWith('[') 
                    ? entry.name.replace(/\[(\w+)\]/, ':$1')
                    : entry.name
                const newPath = currentPath ? `${currentPath}/${routePath}` : `/${routePath}`
                await this.loadRoutes(fullPath, newPath)
            } 
            else if (entry.name === 'controller.ts') {
                await this.registerController(fullPath, currentPath || '/')
            }
        }

        return this.router
    }

    private static async registerController(fullPath: string, routePath: string) {
        try {
            const controller = await import(`file://${fullPath}`)
            const methods: Record<string, HttpMethod> = {
                GET: 'get', POST: 'post', PUT: 'put', 
                DELETE: 'delete', PATCH: 'patch'
            }

            Object.entries(methods).forEach(([method, fn]) => {
                if (controller[method]) {
                    const middleware = XMiddleware.getMiddleware(routePath, method)
                    this.router[fn](routePath, ...middleware, controller[method] as RouteHandler)
                }
            })
        } catch {}
    }
}

export default XRoutes 