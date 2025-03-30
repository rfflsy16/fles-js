import type { Server as BunServer } from "bun";
import type { IncomingMessage, ServerResponse } from "http";

// Base Request and Response types
export interface FlesRequest extends IncomingMessage {
    params: Record<string, string>;
    query: Record<string, string>;
    body: unknown;
    // Runtime type checking with zod can be added here
}

export interface FlesResponse extends ServerResponse {
    json(data: unknown): void;
    send(text: string): void;
    status(code: number): FlesResponse;
}

// Handler and Middleware types
export type FlesRequestHandler = (
    req: FlesRequest,
    res: FlesResponse
) => Promise<void> | void;

export type FlesMiddleware = (
    req: FlesRequest,
    res: FlesResponse,
    next: () => Promise<void>
) => Promise<void> | void;

// Server Configuration
export interface ServerConfig {
    port: number;
    hostname?: string;
    development?: boolean;
}

// Controller type for route handlers
export type Controller = FlesRequestHandler;

// Base Entity for CRUD operations
export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
}

// Repository interface
export interface BaseRepository<T extends BaseEntity> {
    findAll(): Promise<T[]>;
    findById(id: string): Promise<T | null>;
    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}

// Service interface
export interface BaseService<T extends BaseEntity> {
    getAll(): Promise<T[]>;
    getById(id: string): Promise<T | null>;
    create(data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T | null>;
    delete(id: string): Promise<boolean>;
}
