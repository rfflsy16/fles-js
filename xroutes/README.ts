// # 📚 FLES-JS XRoutes Documentation

// ## 🔷 How to Use

// ### 1. Install Package
// ```bash
// npm install fles-js-xroutes
// ```

// ### 2. Basic Setup
// ```javascript
// import express from 'express'
// import { XRoutes, XMiddleware } from 'fles-js-xroutes'

// const app = express()

// await XRoutes.createServer(app, { dir: 'src' })

// app.listen(3000)
// ```

// ### 3. Folder Structure
// ```
// project/
// ├── src/
// │   └── routes/           <- MUST be named "routes"
// │       ├── users/
// │       │   └── controller.ts
// │       └── admin/
// │           └── controller.ts
// ```

// ### 4. Controller Format
// **A. Function Format**
// ```javascript
// export async function GET(req: Request, res: Response) {
//     res.json({ message: 'Hello' })
// }
// ```

// **B. Class Format**
// ```javascript
// export default class UserController {
//     static async getUsers(req: Request, res: Response) {
//         res.json({ users: [] })
//     }
// }
// ```

// ---

// ## 🔷 Middleware Features

// ### 1. Basic Middleware Setup
// ```javascript
// XMiddleware.setup({
//     global: [
//         async (req, res, next) => {
//             console.log('Request received!')
//             next()
//         }
//     ]
// })
// ```

// ### 2. Route Specific Middleware
// ```javascript
// XMiddleware.setup({
//     routes: {
//         '/admin/*': [
//             async (req, res, next) => {
//                 console.log('Admin route!')
//                 next()
//             }
//         ]
//     }
// })
// ```

// ### 3. Method Specific Middleware
// ```javascript
// XMiddleware.setup({
//     routes: {
//         '/api/users': {
//             GET: [middleware1],
//             POST: [middleware2],
//             PUT: [middleware3],
//             DELETE: [middleware4]
//         }
//     }
// })
// ```

// ---

// ## 🔷 Route Patterns

// ### 1. Basic Pattern
// - `/admin`     -> Exact match
// - `/api`       -> Exact match

// ### 2. Wildcard
// - `/admin/*`   -> All paths under `/admin`
// - `*/admin`    -> All paths ending with `admin`
// - `*/admin/*`  -> All paths containing `admin` in the middle

// ### 3. Dynamic Route
// - `users/[id]`   -> `/users/:id`
// - `posts/[slug]` -> `/posts/:slug`

// ### 4. Match Examples
// **'/admin/*' Matches:**
// - ✅ `/admin/users`
// - ✅ `/admin/settings`
// - ❌ `/admin`
// - ❌ `/api/admin`

// ---

// ## 🔷 Tips & Tricks

// ### 1. Middleware
// - Global runs first
// - Route-specific runs second
// - Method-specific runs last
// - Can combine multiple middleware

// ### 2. Best Practices
// - Create reusable middleware
// - Always validate input
// - Handle errors properly
// - Use TypeScript for stability
// - Clear documentation for team

// ### 3. Error Handling
// - Always use try-catch
// - Return error with clear description
// - Error logging is important
// - Handle async errors carefully

// ### 4. Performance
// - Use cache when needed
// - Minimize middleware quantity
// - Optimize database calls
// - Monitor response time

// ---

// ## 🔷 Example Full

// ```javascript
// import express from 'express'
// import { XRoutes, XMiddleware } from 'fles-js-xroutes'

// const app = express()

// // Basic middleware
// app.use(express.json())

// // Setup middleware
// XMiddleware.setup({
//     global: [
//         async (req, res, next) => {
//             console.log('Request masuk!')
//             next()
//         }
//     ],
//     routes: {
//         '/admin/*': [
//             async (req, res, next) => {
//                 console.log('Admin route!')
//                 next()
//             }
//         ],
//         '/api/users': {
//             GET: [middleware1],
//             POST: [middleware2]
//         }
//     }
// })

// // Create server
// await XRoutes.createServer(app, { dir: 'src' })

// app.listen(3000, () => {
//     console.log('Server jalan di port 3000')
// })
// ```

