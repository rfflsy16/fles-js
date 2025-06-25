export default `import jwt from "jsonwebtoken"

interface TokenPayload {
    userId: string
    email: string
    role?: string
}

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "24h"

export const createToken = async (payload: TokenPayload): Promise<string> => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN },
            (error, token) => {
                if (error) reject(error)
                resolve(token as string)
            }
        )
    })
}

export const verifyToken = async (token: string): Promise<TokenPayload> => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, JWT_SECRET, (error, decoded) => {
            if (error) reject(error)
            resolve(decoded as TokenPayload)
        })
    })
}`