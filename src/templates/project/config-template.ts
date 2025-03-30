export function createConfigTs(): string {
    return `import dotenv from "dotenv";

    // Load environment variables from .env file
    dotenv.config();

    export const config = {
    // Server configuration
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    env: process.env.NODE_ENV || "development",
    
    // Database configuration
    database: {
        url: process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5432/fles_app",
        ssl: process.env.DATABASE_SSL === "true",
    },
    
    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET || "super-secret-key-change-in-production",
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    },
    
    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN || "*",
    },
    };
    `;
}
