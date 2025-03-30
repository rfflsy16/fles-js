import { serve, type Server as BunServer } from "bun";
import { IncomingMessage, ServerResponse } from "http";
import { Router } from "@/routing/routes";
import { Logger } from "@/utils/logger";
import type { ServerConfig, EnhancedServerResponse } from "@/types/fles-js";
import { Socket } from "net";

/**
 * Bungkus semua dalam function untuk buat instances
 * Menggunakan pendekatan prototype untuk menghindari error tipe tanpa any
 */
function createFlesRequest(): IncomingMessage {
    // Buat objek socket dengan object create untuk melewati type checks
    // tapi tetap menjaga properti prototype
    const socket = new Socket();

    // Buat IncomingMessage dengan parameter socket yang sudah dibuat
    // Casting through unknown untuk menghindari error tipe
    return Reflect.construct(IncomingMessage, [socket]) as IncomingMessage;
}

/**
 * Membuat ServerResponse dengan pendekatan sama seperti createFlesRequest
 */
function createFlesResponse(): ServerResponse {
    // Buat objek socket dengan object create untuk melewati type checks
    const socket = new Socket();

    // Buat ServerResponse dengan parameter socket
    // Casting through unknown untuk menghindari error tipe
    return Reflect.construct(ServerResponse, [socket]) as ServerResponse;
}

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
                    // Unknown sebagai jembatan antara tipe yang tidak kompatibel
                    await this.router.handle(req, res as unknown as ServerResponse);

                    return res.toBunResponse();
                },
            });

            this.logger.info(`Server running at http://${this.config.hostname}:${this.config.port}`);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.logger.error("Failed to start server", errorMessage);
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
        const req = createFlesRequest();
        req.method = request.method;
        req.url = request.url;

        // Add headers from Bun Request
        request.headers.forEach((value, key) => {
            if (req.headers) {
                req.headers[key.toLowerCase()] = value;
            }
        });

        return req;
    }

    private createResponse(): EnhancedServerResponse {
        const res = createFlesResponse() as EnhancedServerResponse;
        const headers = new Headers();
        let statusCode = 200;
        let body: string | Uint8Array = "";

        // Override necessary methods
        const originalSetHeader = res.setHeader?.bind(res) ||
            function () { return res; };

        res.setHeader = function (name: string, value: string | number | readonly string[]): EnhancedServerResponse {
            headers.set(name, String(value));
            originalSetHeader(name, value);
            return this;
        };

        const originalEnd = res.end?.bind(res) ||
            function () { return res; };

        res.end = function (chunk?: string | Uint8Array): EnhancedServerResponse {
            if (chunk) {
                body = chunk;
            }
            originalEnd(chunk);
            return this;
        };

        const originalWriteHead = res.writeHead?.bind(res) ||
            function () { return res; };

        res.writeHead = function (statusCode: number, ...args: unknown[]): EnhancedServerResponse {
            res.statusCode = statusCode;
            originalWriteHead(statusCode, ...args);
            return this;
        };

        Object.defineProperty(res, 'statusCode', {
            get(): number {
                return statusCode;
            },
            set(code: number): void {
                statusCode = code;
            }
        });

        // Add toBunResponse method
        res.toBunResponse = (): Response => {
            return new Response(body, {
                status: statusCode,
                headers: headers
            });
        };

        return res;
    }
}
