import http from "http";
import { parse as parseUrl } from "url";
import { Logger } from "../utils/logger.js";
import { FlesRequest, FlesResponse, FlesRequestHandler, FlesMiddleware } from "../types/index.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

export type RequestHandler = FlesRequestHandler;
export type Middleware = FlesMiddleware;

interface Route {
    method: HttpMethod;
    path: string;
    handlers: Array<Middleware | RequestHandler>;
}

export class Router {
    private routes: Route[] = [];
    private globalMiddleware: Middleware[] = [];
    private logger: Logger;
    [key: string]: any | ((path: string, ...handlers: Array<Middleware | RequestHandler>) => void);

    constructor() {
        this.logger = new Logger();
    }

    public use(pathOrMiddleware: string | Middleware | ((app: Router) => void), ...handlers: Array<Middleware | RequestHandler>): void {
        // Case 1: fles.use(middleware) - middleware global
        if (typeof pathOrMiddleware === 'function' && pathOrMiddleware.length === 3) {
            this.globalMiddleware.push(pathOrMiddleware as Middleware);
            return;
        }

        // Case 2: fles.use(fn) - router function seperti di Express
        if (typeof pathOrMiddleware === 'function' && pathOrMiddleware.length <= 1) {
            (pathOrMiddleware as (app: Router) => void)(this);
            return;
        }

        // Case 3: fles.use('/prefix', middleware1, middleware2) - middleware dengan prefix
        if (typeof pathOrMiddleware === 'string' && handlers.length > 0) {
            const prefix = pathOrMiddleware;

            // Proses setiap handler
            handlers.forEach(handler => {
                if (this.isMiddleware(handler)) {
                    // Gak diimplementasi full - hanya contoh
                    this.addPrefixedMiddleware(prefix, handler as Middleware);
                }
            });
        }
    }

    private addPrefixedMiddleware(prefix: string, middleware: Middleware): void {
        const prefixedMiddleware: Middleware = async (req, res, next) => {
            const path = req.url || '/';
            if (path.startsWith(prefix)) {
                await middleware(req, res, next);
            } else {
                await next();
            }
        };

        this.globalMiddleware.push(prefixedMiddleware);
    }

    public get(path: string, ...handlers: Array<Middleware | RequestHandler>): void {
        this.addRoute("GET", path, handlers);
    }

    public post(path: string, ...handlers: Array<Middleware | RequestHandler>): void {
        this.addRoute("POST", path, handlers);
    }

    public put(path: string, ...handlers: Array<Middleware | RequestHandler>): void {
        this.addRoute("PUT", path, handlers);
    }

    public delete(path: string, ...handlers: Array<Middleware | RequestHandler>): void {
        this.addRoute("DELETE", path, handlers);
    }

    public patch(path: string, ...handlers: Array<Middleware | RequestHandler>): void {
        this.addRoute("PATCH", path, handlers);
    }

    private addRoute(method: HttpMethod, path: string, handlers: Array<Middleware | RequestHandler>): void {
        this.routes.push({ method, path, handlers });
    }

    public async handle(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const method = req.method as HttpMethod;
        const parsedUrl = parseUrl(req.url || "/");
        const path = parsedUrl.pathname || "/";

        // Tambahkan query params
        const flesReq = req as FlesRequest;
        const query: Record<string, string> = {};
        const searchParams = new URLSearchParams(parsedUrl.search || "");
        searchParams.forEach((value, key) => {
            query[key] = value;
        });
        flesReq.query = query;

        // Find matching route dengan path matching yg lebih canggih
        let matchedRoute: Route | undefined;
        for (const route of this.routes) {
            if (route.method === method && this.matchPath(route.path, path)) {
                matchedRoute = route;

                // Extract route params dan tambahkan ke request
                flesReq.params = this.extractParams(route.path, path);
                break;
            }
        }

        if (!matchedRoute) {
            res.statusCode = 404;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: "Not Found" }));
            return;
        }

        // Execute global middleware first
        await this.executeMiddleware(this.globalMiddleware, req, res);

        // If response already sent by middleware, return
        if (res.writableEnded) return;

        // Execute route handlers
        let currentHandlerIndex = 0;
        const executeNextHandler = async (): Promise<void> => {
            if (currentHandlerIndex < matchedRoute.handlers.length) {
                const handler = matchedRoute.handlers[currentHandlerIndex];
                currentHandlerIndex++;

                if (this.isMiddleware(handler)) {
                    await (handler as Middleware)(req as FlesRequest, res as FlesResponse, executeNextHandler);
                } else {
                    await (handler as RequestHandler)(req as FlesRequest, res as FlesResponse);
                }
            }
        };

        await executeNextHandler();
    }

    private async executeMiddleware(
        middleware: Middleware[],
        req: http.IncomingMessage,
        res: http.ServerResponse
    ): Promise<void> {
        let currentIndex = 0;

        const next = async (): Promise<void> => {
            if (currentIndex < middleware.length) {
                const currentMiddleware = middleware[currentIndex];
                currentIndex++;
                await currentMiddleware(req as FlesRequest, res as FlesResponse, next);
            }
        };

        if (middleware.length > 0) {
            await next();
        }
    }

    private isMiddleware(handler: Middleware | RequestHandler): handler is Middleware {
        return handler.length > 2;
    }

    private matchPath(routePath: string, requestPath: string): boolean {
        // Jika path sama persis, langsung return true
        if (routePath === requestPath) return true;

        // Jika mengandung parameter dinamis, proses lebih lanjut
        if (routePath.includes(":")) {
            const routeParts = routePath.split("/");
            const requestParts = requestPath.split("/");

            // Panjang path harus sama
            if (routeParts.length !== requestParts.length) return false;

            // Periksa setiap bagian path
            for (let i = 0; i < routeParts.length; i++) {
                const routePart = routeParts[i];

                // Jika ini parameter dinamis, cocok dan lanjutkan
                if (routePart.startsWith(":")) continue;

                // Jika bagian statis tidak cocok, return false
                if (routePart !== requestParts[i]) return false;
            }

            return true;
        }

        return false;
    }

    private extractParams(routePath: string, requestPath: string): Record<string, string> {
        const params: Record<string, string> = {};

        const routeParts = routePath.split("/");
        const requestParts = requestPath.split("/");

        for (let i = 0; i < routeParts.length; i++) {
            const routePart = routeParts[i];

            if (routePart.startsWith(":")) {
                const paramName = routePart.substring(1); // Hapus ':' dari awal
                params[paramName] = requestParts[i];
            }
        }

        return params;
    }

    // Tambahan method baru untuk route prefix
    public prefix(path: string): Router {
        const prefixedRouter = new Router();

        // Define methods with proper typing
        prefixedRouter.get = (routePath: string, ...handlers: Array<Middleware | RequestHandler>) => {
            this.get(`${path}${routePath}`, ...handlers);
            return prefixedRouter;
        };

        prefixedRouter.post = (routePath: string, ...handlers: Array<Middleware | RequestHandler>) => {
            this.post(`${path}${routePath}`, ...handlers);
            return prefixedRouter;
        };

        prefixedRouter.put = (routePath: string, ...handlers: Array<Middleware | RequestHandler>) => {
            this.put(`${path}${routePath}`, ...handlers);
            return prefixedRouter;
        };

        prefixedRouter.delete = (routePath: string, ...handlers: Array<Middleware | RequestHandler>) => {
            this.delete(`${path}${routePath}`, ...handlers);
            return prefixedRouter;
        };

        prefixedRouter.patch = (routePath: string, ...handlers: Array<Middleware | RequestHandler>) => {
            this.patch(`${path}${routePath}`, ...handlers);
            return prefixedRouter;
        };

        return prefixedRouter;
    }
} 