import { parse as parseUrl } from "url";
import type { IncomingMessage, ServerResponse } from "http";
import { Logger } from "../utils/logger.js";
import type { FlesRequest, FlesResponse, FlesRequestHandler, FlesMiddleware } from "../types/fles-js.d.ts";

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
    [key: string]: unknown;

    constructor() {
        this.logger = new Logger("Router");
    }

    // Register middleware
    public use(pathOrMiddleware: string | Middleware | ((app: Router) => void), ...handlers: Array<Middleware | RequestHandler>): void {
        // Case 1: Global middleware registration
        if (typeof pathOrMiddleware === 'function' && pathOrMiddleware.length === 3) {
            this.globalMiddleware.push(pathOrMiddleware as Middleware);
            return;
        }

        // Case 2: Router function (express-style)
        if (typeof pathOrMiddleware === 'function' && pathOrMiddleware.length <= 1) {
            (pathOrMiddleware as (app: Router) => void)(this);
            return;
        }

        // Case 3: Path-prefixed middleware
        if (typeof pathOrMiddleware === 'string' && handlers.length > 0) {
            const prefix = pathOrMiddleware;

            handlers.forEach(handler => {
                if (this.isMiddleware(handler)) {
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

    // HTTP method handlers
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

    // Route registration helper
    private addRoute(method: HttpMethod, path: string, handlers: Array<Middleware | RequestHandler>): void {
        if (handlers.length === 0) {
            throw new Error(`No handlers provided for ${method} ${path}`);
        }
        this.routes.push({ method, path, handlers });
    }

    // Main request handler
    public async handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
        const method = req.method as HttpMethod;
        const parsedUrl = parseUrl(req.url || "/");
        const path = parsedUrl.pathname || "/";

        // Setup request extras
        const flesReq = req as FlesRequest;
        const flesRes = res as FlesResponse;

        // Initialize query and params
        flesReq.params = {};
        flesReq.query = {};

        // Parse query parameters
        if (parsedUrl.query) {
            // Gunakan metode yang berbeda untuk parsing query
            const queryString = String(parsedUrl.query);
            const entries = queryString.split('&').map(pair => {
                const parts = pair.split('=');
                const key = parts[0] ? decodeURIComponent(parts[0]) : '';
                const value = parts[1] ? decodeURIComponent(parts[1]) : '';
                return [key, value] as [string, string];
            });

            entries.forEach(([key, value]) => {
                if (key) flesReq.query[key] = value;
            });
        }

        // Add response helpers
        flesRes.json = function (data: unknown): void {
            this.setHeader("Content-Type", "application/json");
            this.end(JSON.stringify(data));
        };

        flesRes.send = function (text: string): void {
            this.setHeader("Content-Type", "text/plain");
            this.end(text);
        };

        flesRes.status = function (code: number): FlesResponse {
            this.statusCode = code;
            return this;
        };

        // Find matching route
        let matchedRoute: Route | undefined;
        for (const route of this.routes) {
            if (route.method === method && this.matchPath(route.path, path)) {
                matchedRoute = route;

                // Extract route params
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
        await this.executeMiddleware(this.globalMiddleware, flesReq, flesRes);

        // If response already sent by middleware, return
        if (res.writableEnded) return;

        // Execute route handlers
        let currentHandlerIndex = 0;
        const executeNextHandler = async (): Promise<void> => {
            if (currentHandlerIndex < matchedRoute!.handlers.length) {
                const handler = matchedRoute!.handlers[currentHandlerIndex];
                currentHandlerIndex++;

                if (handler && this.isMiddleware(handler)) {
                    await (handler as Middleware)(flesReq, flesRes, executeNextHandler);
                } else if (handler) {
                    await (handler as RequestHandler)(flesReq, flesRes);
                }
            }
        };

        await executeNextHandler();
    }

    // Middleware executor
    private async executeMiddleware(
        middleware: Middleware[],
        req: FlesRequest,
        res: FlesResponse
    ): Promise<void> {
        let currentIndex = 0;

        const next = async (): Promise<void> => {
            if (currentIndex < middleware.length) {
                const currentMiddleware = middleware[currentIndex];
                currentIndex++;
                if (currentMiddleware) {
                    await currentMiddleware(req, res, next);
                }
            }
        };

        if (middleware.length > 0) {
            await next();
        }
    }

    // Type guard for middleware
    private isMiddleware(handler: Middleware | RequestHandler): handler is Middleware {
        return handler.length > 2;
    }

    // Path matching logic
    private matchPath(routePath: string, requestPath: string): boolean {
        // Exact match
        if (routePath === requestPath) return true;

        // Dynamic route parameters
        if (routePath.includes(":")) {
            const routeParts = routePath.split("/");
            const requestParts = requestPath.split("/");

            // Path parts length must match
            if (routeParts.length !== requestParts.length) return false;

            // Check each path segment
            for (let i = 0; i < routeParts.length; i++) {
                const routePart = routeParts[i];

                // Skip parameter segments
                if (routePart && routePart.startsWith(":")) continue;

                // Static segments must match
                if (routePart !== requestParts[i]) return false;
            }

            return true;
        }

        return false;
    }

    // Extract parameters from path
    private extractParams(routePath: string, requestPath: string): Record<string, string> {
        const params: Record<string, string> = {};

        const routeParts = routePath.split("/");
        const requestParts = requestPath.split("/");

        for (let i = 0; i < routeParts.length; i++) {
            const routePart = routeParts[i];
            const requestPart = requestParts[i];

            if (routePart && requestPart && routePart.startsWith(":")) {
                const paramName = routePart.substring(1);
                params[paramName] = requestPart;
            }
        }

        return params;
    }

    // Create a prefixed router
    public prefix(path: string): Router {
        const prefixedRouter = new Router();

        // Define proper typings for HTTP methods
        prefixedRouter.get = (routePath: string, ...handlers: Array<Middleware | RequestHandler>): void => {
            this.get(`${path}${routePath}`, ...handlers);
        };

        prefixedRouter.post = (routePath: string, ...handlers: Array<Middleware | RequestHandler>): void => {
            this.post(`${path}${routePath}`, ...handlers);
        };

        prefixedRouter.put = (routePath: string, ...handlers: Array<Middleware | RequestHandler>): void => {
            this.put(`${path}${routePath}`, ...handlers);
        };

        prefixedRouter.delete = (routePath: string, ...handlers: Array<Middleware | RequestHandler>): void => {
            this.delete(`${path}${routePath}`, ...handlers);
        };

        prefixedRouter.patch = (routePath: string, ...handlers: Array<Middleware | RequestHandler>): void => {
            this.patch(`${path}${routePath}`, ...handlers);
        };

        return prefixedRouter;
    }
}
