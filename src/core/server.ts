import http from "http";
import { AddressInfo } from "net";
import { Router } from "../routing/router.js";
import { Logger } from "../utils/logger.js";
import { FlesRequest, FlesResponse } from "../types/index.js";
export interface ServerConfig {
    port: number;
    host?: string;
}

export class Server {
    private server: http.Server;
    private router: Router;
    private logger: Logger;
    private port: number;
    private host: string;

    constructor(config: ServerConfig) {
        this.port = config.port || 3000;
        this.host = config.host || "localhost";
        this.router = new Router();
        this.logger = new Logger();

        this.server = http.createServer((req, res) => this.handleRequest(req as FlesRequest, res as FlesResponse));
    }

    private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        try {
            // Convert standard req/res to Fles types
            const flesReq = req as FlesRequest;
            const flesRes = res as FlesResponse;
    
            // Initialize Fles properties
            flesReq.params = {};
            flesReq.query = {};
            flesReq.body = {};
            
            // Implement FlesResponse methods
            flesRes.json = function(data: unknown): void {
                this.setHeader("Content-Type", "application/json");
                this.end(JSON.stringify(data));
            };
            
            flesRes.send = function(text: string): void {
                this.setHeader("Content-Type", "text/plain");
                this.end(text);
            };
            
            flesRes.status = function(code: number): FlesResponse {
                this.statusCode = code;
                return this;
            };
    
            await this.router.handle(flesReq, flesRes);
        } catch (error) {
            this.logger.error("Server error", error);
            if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Internal Server Error" }));
            }
        }
    }

    public registerRoutes(getRouter: () => Router): void {
        this.router = getRouter();
    }

    public async start(): Promise<void> {
        return new Promise<void>((resolve) => {
            this.server.listen(this.port, this.host, () => {
                const address = this.server.address() as AddressInfo;
                this.logger.info(`Server running at http://${this.host}:${address.port}`);
                resolve();
            });
        });
    }

    public async stop(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this.server.close((err) => {
                if (err) {
                    this.logger.error("Error closing server", err);
                    reject(err);
                } else {
                    this.logger.info("Server stopped");
                    resolve();
                }
            });
        });
    }
} 