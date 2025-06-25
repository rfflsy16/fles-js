import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"

// Auto-generated schema imports
// {{schemaImports}}

/**
 * TODO: Authentication Setup
 * 1. Import auth functions:
 *    import { authenticated, authorized } from "./utils/auth.js"
 * 
 * 2. Add context to startStandaloneServer:
 *    context: async ({ req }) => ({
 *        authenticated: () => authenticated(req),
 *        authorized: (authorId) => authorized(req, authorId)
 *    })
 * 
 * 3. Add environment variables in .env:
 *    PORT=4000
 *    JWT_SECRET=your_secret_key
 */

const server = new ApolloServer({
    typeDefs: [
        // {{typeDefs}}
    ],
    resolvers: [
        // {{resolvers}}
    ],
    introspection: true,
})

const PORT = process.env.PORT || 4000

const { url } = await startStandaloneServer(server, {
    listen: { port: PORT }
    // TODO: Add your context here
})

console.log(`🚀  Server ready at: ${url}`)