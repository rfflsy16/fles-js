import http from "http";
import { parse as parseUrl } from "url";
import { Logger } from "../utils/logger.js";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS" | "HEAD";

export type RequestHandler = (
    req: http.IncomingMessage,
    res: http.ServerResponse
) => Promise<void> | void;

export type Middleware = (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next: () => Promise<void>
) => Promise<void> | void;

interface Route {
    method: HttpMethod;
    path: string;
    handlers: Array<Middleware | RequestHandler>;
}

export class Router {
    private routes: Route[] = [];
    private globalMiddleware: Middleware[] = [];
    private logger: Logger;

    constructor() {
        this.logger = new Logger();
    }

    public use(middleware: Middleware): void {
        this.globalMiddleware.push(middleware);
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

        // Find matching route
        const route = this.routes.find(
            (r) => r.method === method && this.matchPath(r.path, path)
        );

        if (!route) {
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
            if (currentHandlerIndex < route.handlers.length) {
                const handler = route.handlers[currentHandlerIndex];
                currentHandlerIndex++;

                if (this.isMiddleware(handler)) {
                    await (handler as Middleware)(req, res, executeNextHandler);
                } else {
                    await (handler as RequestHandler)(req, res);
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
                await currentMiddleware(req, res, next);
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
        // Simple path matching for now - will improve later
        // This just checks for exact matches 
        return routePath === requestPath;
    }
} 