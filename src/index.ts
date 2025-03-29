import { Server, ServerConfig } from "./core/server.js";
import { Router, HttpMethod, RequestHandler, Middleware } from "./routing/router.js";

export class Fles {
    private server: Server;
    private router: Router;

    constructor(config: ServerConfig = { port: 3000 }) {
        this.server = new Server(config);
        this.router = new Router();

        // Register routes to server
        this.server.registerRoutes((router) => {
            // Copy routes from this.router to the server's router
            // This will be implemented in the future
            this.router = router;
        });
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
    public use(middleware: Middleware): void {
        this.router.use(middleware);
    }

    // Start the server
    public async start(port?: number): Promise<void> {
        if (port) {
            this.server = new Server({ port });
            
            // Re-register routes
            this.server.registerRoutes((router) => {
                this.router = router;
            });
        }
        
        return this.server.start();
    }

    // Stop the server
    public async stop(): Promise<void> {
        return this.server.stop();
    }
}

// Export types and interfaces
export { Router, HttpMethod, RequestHandler, Middleware } from "./routing/router.js";
export { ServerConfig } from "./core/server.js";
export { Logger, LogLevel } from "./utils/logger.js";