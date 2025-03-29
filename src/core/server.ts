import http from "http";
import { AddressInfo } from "net";
import { Router } from "../routing/router.js";
import { Logger } from "../utils/logger.js";

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

        this.server = http.createServer(this.handleRequest.bind(this));
    }

    private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        try {
            await this.router.handle(req, res);
        } catch (error) {
            this.logger.error("Server error", error);
            if (!res.headersSent) {
                res.statusCode = 500;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "Internal Server Error" }));
            }
        }
    }

    public registerRoutes(setupRoutes: (router: Router) => void): void {
        setupRoutes(this.router);
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