import { GraphQLError } from "graphql"

/**
 * TODO: Authentication Flow
 * 1. Create jwt.js in utils folder
 * 2. Import your auth model (e.g., User, Admin, etc)
 * 3. Implement token verification
 * 4. Add your authentication logic below
 */

export const authenticated = async (req) => {
    // TODO: Implement your authentication logic
    // Example flow:
    // 1. Get token from headers
    // 2. Verify token
    // 3. Find user/admin
    // 4. Return user data
    throw new GraphQLError("Authentication not implemented", {
        extensions: {
            http: "501",
            code: "NOT_IMPLEMENTED",
        },
    })
}

export const authorized = async (req, authorId) => {
    // TODO: Implement your authorization logic
    // Example flow:
    // 1. Get authenticated user
    // 2. Check permissions
    // 3. Allow/deny access
    throw new GraphQLError("Authorization not implemented", {
        extensions: { 
            http: "501", 
            code: "NOT_IMPLEMENTED" 
        }
    })
} 