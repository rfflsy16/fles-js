export default `import dotenv from 'dotenv'
import express from 'express'
import { XRoutes, XMiddleware } from 'fles-js-xroutes'
import { connect } from '@config/mongodb'

// Load environment variables
dotenv.config()

/*
 * 📚 Tutorial Express + XRoutes:
 * 
 * 🔥 XRoutes Features:
 * - Auto-routing from folder structure (similar to NextJS)
 * - Must use controller.ts (not route.ts)
 * - Support middleware per route/global
 * - Compatible with Express & Bun
 * 
 * 📁 Struktur Route:
 * src/
 *  ├─ products/
 *  │   ├─ [id]/
 *  │   │   └─ controller.ts    => /products/:id
 *  │   └─ controller.ts        => /products
 *  ├─ users/
 *  │   ├─ [id]/
 *  │   │   └─ controller.ts    => /users/:id
 *  │   └─ controller.ts        => /users
 *  └─ auth/
 *      └─ controller.ts        => /auth
 * 
 * 🔐 Route Middleware Examples:
 * - '/products/*': All routes /products
 * - '/users': Exact route /users
 * - '/users/*': Routes containing /users/
 */

const app = express()
const port = process.env.PORT || 3000

/*
 * 🛠️ Content-Length Fix for Bun:
 * Reset content-length on:
 * 1. GET requests
 * 2. OPTIONS (CORS)
 * 3. Non-JSON requests
 */
app.use((req, res, next) => {
    if (
        req.method === 'GET' || 
        req.method === 'OPTIONS' ||
        !req.is('application/json')
    ) {
        req.headers['content-length'] = undefined;
    }
    next();
});

// Basic middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Setup simple logging middleware
XMiddleware.setup({
    // Global middleware
    global: [
        async (req, res, next) => {
            console.log(\`🚀 \${req.method} \${req.path}\`)
            next()
        }
    ],
    
    // Route specific middleware
    /*
    routes: {
        '/products/*': [
            async (req, res, next) => {
                console.log('📦 Products Route accessed')
                next()
            }
        ],
        
        '/users': [
            async (req, res, next) => {
                console.log('👥 Users Route accessed!')
                next()
            }
        ],
        
        '/users/*': [
            async (req, res, next) => {
                console.log('👤 User Detail Route accessed!')
                next()
            }
        ]
    }
    */

    // If using middleware from other files
    // Import the middleware at the top first
    /*
    routes: {
        '/products/*': [
            authMiddleware,
            loggerMiddleware,
            multerMiddleware
        ]
    }
    */
})

// Start server dgn auto-routing
await XRoutes.createServer(app, { dir: 'src' })

// Test MongoDB connection before starting server
let isMongoConnected = false
try {
    await connect()
    isMongoConnected = true
} catch (error: unknown) {
    console.error('❌ MongoDB Connection Error:', (error as Error).message)
}

app.listen(port, () => {
    console.log(\`🚀 Server is running on:
   - Port: http://localhost:\${port}
   - Environment: \${process.env.NODE_ENV || 'development'}
   - MongoDB: \${isMongoConnected ? 'Connected' : 'Failed to connect'}\`)
})
` 