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
} 