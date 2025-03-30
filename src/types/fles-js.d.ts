declare module 'fles-js' {
    export { Fles } from '../index.js';
    export { Router } from '../routing/router.js';
    export { FlesRequest, FlesResponse } from '../types/index.js';
    export type { HttpMethod, RequestHandler, Middleware } from '../routing/router.js';
    export { ServerConfig } from '../core/server.js';
    export { Logger, LogLevel } from '../utils/logger.js';
    export const createRouter: () => Router;
}