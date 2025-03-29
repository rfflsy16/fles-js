import http from 'http';
import fs from 'fs';
import path from 'path';
import { Stream } from 'stream';

export class Response {
    private res: http.ServerResponse;
    private headersSent = false;
    private statusCode = 200;
    private headers: Record<string, string | string[]> = {
        'Content-Type': 'application/json'
    };

    constructor(res: http.ServerResponse) {
        this.res = res;
    }

    public status(code: number): Response {
        this.statusCode = code;
        return this;
    }

    public header(name: string, value: string | string[]): Response {
        this.headers[name] = value;
        return this;
    }

    public json(data: any): void {
        this.header('Content-Type', 'application/json');
        this.send(JSON.stringify(data));
    }

    public text(data: string): void {
        this.header('Content-Type', 'text/plain');
        this.send(data);
    }

    public html(data: string): void {
        this.header('Content-Type', 'text/html');
        this.send(data);
    }

    public send(data: string | Buffer): void {
        if (this.headersSent) {
            return;
        }

        this.writeHeaders();
        this.res.end(data);
    }

    public async file(filePath: string, options?: { download?: boolean; filename?: string }): Promise<void> {
        if (this.headersSent) {
            return;
        }

        try {
            const stats = await fs.promises.stat(filePath);

            if (!stats.isFile()) {
                this.status(404).json({ error: 'File not found' });
                return;
            }

            const contentType = this.getContentType(filePath);
            this.header('Content-Type', contentType);

            if (options?.download) {
                const filename = options.filename || path.basename(filePath);
                this.header('Content-Disposition', `attachment; filename="${filename}"`);
            }

            this.writeHeaders();

            const stream = fs.createReadStream(filePath);
            stream.pipe(this.res);

            stream.on('error', () => {
                if (!this.res.writableEnded) {
                    this.res.end();
                }
            });

        } catch (error) {
            if (!this.headersSent) {
                this.status(404).json({ error: 'File not found' });
            }
        }
    }

    public stream(stream: Stream): void {
        if (this.headersSent) {
            return;
        }

        this.writeHeaders();
        stream.pipe(this.res);

        stream.on('error', () => {
            if (!this.res.writableEnded) {
                this.res.end();
            }
        });
    }

    public redirect(url: string, statusCode = 302): void {
        this.status(statusCode);
        this.header('Location', url);
        this.send(`Redirecting to ${url}`);
    }

    private writeHeaders(): void {
        this.res.statusCode = this.statusCode;

        for (const [name, value] of Object.entries(this.headers)) {
            this.res.setHeader(name, value);
        }

        this.headersSent = true;
    }

    private getContentType(filePath: string): string {
        const ext = path.extname(filePath).toLowerCase();

        const mimeTypes: Record<string, string> = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
            '.txt': 'text/plain',
        };

        return mimeTypes[ext] || 'application/octet-stream';
    }
}
