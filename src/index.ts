import { Server } from "@/core/server";
import type { ServerConfig } from "@/types/fles-js";
import { Router, type HttpMethod, type RequestHandler, type Middleware } from "@/routing/routes";

export class Fles {
    private server: Server;
    private router: Router;

    constructor(config: ServerConfig = { port: 3000 }) {
        this.server = new Server(config);
        this.router = new Router();
    }

    // Express-like API for routing
    public get(path: string, ...handlers: Array<RequestHandler | Middleware>): void {
        this.router.get(path, ...handlers);
    }

    public post(path: string, ...handlers: Array<RequestHandler | Middleware>): void {
        this.router.post(path, ...handlers);
    }

    public put(path: string, ...handlers: Array<RequestHandler | Middleware>): void {
        this.router.put(path, ...handlers);
    }

    public delete(path: string, ...handlers: Array<RequestHandler | Middleware>): void {
        this.router.delete(path, ...handlers);
    }

    public patch(path: string, ...handlers: Array<RequestHandler | Middleware>): void {
        this.router.patch(path, ...handlers);
    }

    // Middleware registration
    public use(pathOrMiddleware: string | Middleware | ((app: Router) => void), ...handlers: Array<Middleware | RequestHandler>): void {
        this.router.use(pathOrMiddleware, ...handlers);
    }

    // Router factory for creating sub-routers
    public createRouter(prefix: string = ''): Router {
        return this.router.prefix(prefix);
    }

    // Start the server
    public async run(port?: number): Promise<void> {
        if (port) {
            this.server = new Server({ port });
        }

        // Register routes to server
        this.server.registerRoutes(() => this.router);

        return this.server.start();
    }

    // Stop the server
    public async stop(): Promise<void> {
        return this.server.stop();
    }
}

// Export router factory method
export const createRouter = (): Router => new Router();

// Export types and interfaces
export type { HttpMethod, RequestHandler, Middleware } from "@/routing/routes";
export type {
    FlesRequest,
    FlesResponse,
    ServerConfig,
    BaseEntity,
    BaseRepository,
    BaseService,
    Controller,
    EnhancedServerResponse
} from "@/types/fles-js";
export { Logger, LogLevel } from "@/utils/logger";
export { Router } from "@/routing/routes";
