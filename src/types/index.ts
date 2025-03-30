import http from "http";

export interface FlesRequest extends http.IncomingMessage {
    params: Record<string, string>;
    query: Record<string, string>;
    body: unknown;
}

export interface FlesResponse extends http.ServerResponse {
    json(data: unknown): void;
    send(text: string): void;
    status(code: number): FlesResponse;
}

export type FlesRequestHandler = (
    req: FlesRequest,
    res: FlesResponse
) => Promise<void> | void;

export type FlesMiddleware = (
    req: FlesRequest,
    res: FlesResponse,
    next: () => Promise<void>
) => Promise<void> | void;