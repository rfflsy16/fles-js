import { serve, type Server as BunServer } from "bun";
import type { IncomingMessage, ServerResponse } from "http";
import { Router } from "../routing/routes.ts";
import { Logger } from "../utils/logger.js";
import type { ServerConfig } from "../types/fles-js.d.ts";

export class Server {
    private server: BunServer | null = null;
    private router: Router;
    private logger: Logger;
    private config: ServerConfig;

    constructor(config: ServerConfig) {
        this.config = {
            port: config.port || 3000,
            hostname: config.hostname || "localhost",
            development: config.development || false
        };
        this.router = new Router();
        this.logger = new Logger("Server");
    }

    public registerRoutes(getRouter: () => Router): void {
        this.router = getRouter();
    }

    public async start(): Promise<void> {
        if (this.server) {
            this.logger.warn("Server is already running");
            return;
        }

        try {
            this.server = Bun.serve({
                port: this.config.port,
                hostname: this.config.hostname,
                development: this.config.development,
                fetch: async (request) => {
                    // Convert Bun Request to Node's IncomingMessage for compatibility
                    const req = this.convertBunRequest(request);
                    const res = this.createResponse();

                    // Use the router to handle the request
                    await this.router.handle(req, res);

                    return res.toBunResponse();
                },
            });

            this.logger.info(`Server running at http://${this.config.hostname}:${this.config.port}`);
        } catch (error) {
            this.logger.error("Failed to start server", error);
            throw error;
        }
    }

    public async stop(): Promise<void> {
        if (this.server) {
            this.server.stop();
            this.server = null;
            this.logger.info("Server stopped");
        }
    }

    // Helper methods to convert between Bun and Node.js HTTP interfaces
    private convertBunRequest(request: Request): IncomingMessage {
        // This is a simplified conversion - in a real implementation,
        // you would need more comprehensive conversion logic
        const req = new IncomingMessage(null as any);
        req.method = request.method;
        req.url = request.url;

        // Add headers from Bun Request
        request.headers.forEach((value, key) => {
            req.headers[key.toLowerCase()] = value;
        });

        return req;
    }

    private createResponse(): ServerResponse & {
        toBunResponse: () => Response;
    } {
        const res = new ServerResponse(null as any);
        const headers = new Headers();
        let statusCode = 200;
        let body: string | Uint8Array = "";

        // Override necessary methods
        const originalSetHeader = res.setHeader;
        res.setHeader = function (name: string, value: string | number | readonly string[]) {
            headers.set(name, String(value));
            return originalSetHeader.call(this, name, value);
        };

        const originalEnd = res.end;
        res.end = function (chunk?: string | Uint8Array) {
            if (chunk) {
                body = chunk;
            }
            originalEnd.call(this);
            return this;
        };

        const originalWriteHead = res.writeHead;
        res.writeHead = function (statusCode: number) {
            this.statusCode = statusCode;
            return originalWriteHead.call(this, statusCode);
        };

        Object.defineProperty(res, 'statusCode', {
            get() {
                return statusCode;
            },
            set(code: number) {
                statusCode = code;
            }
        });

        // Add toBunResponse method
        res.toBunResponse = () => {
            return new Response(body, {
                status: statusCode,
                headers: headers
            });
        };

        return res as any;
    }
}
