/**
 * TODO: Authentication Flow
 * 1. Create jwt.js in utils folder
 * 2. Import your auth model (e.g., User, Admin, etc)
 * 3. Implement token verification
 * 4. Add your authentication logic below
 */

export const authentication = async (req, res, next) => {
    try {
        // TODO: Implement your authentication logic
        // Example flow:
        // 1. Get token from headers
        // 2. Verify token
        // 3. Find user/admin
        // 4. Add user data to req.user
        throw { name: 'NotImplemented' }
    } catch (error) {
        next(error)
    }
}

export const authorization = async (req, res, next) => {
    try {
        // TODO: Implement your authorization logic
        // Example flow:
        // 1. Get authenticated user from req.user
        // 2. Check permissions
        // 3. Allow/deny access
        throw { name: 'NotImplemented' }
    } catch (error) {
        next(error)
    }
} 