export default `import type { Request, Response, NextFunction } from 'express'
import { z } from 'zod'

export const errorHandler = (
    err: Error, 
    req: Request, 
    res: Response, 
    next: NextFunction
): void => {
    // console.error('🔥 Error:', err)

    // Zod validation errors
    if (err instanceof z.ZodError) {
        res.status(422).json({
            success: false,
            status: 422,
            error: err.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        })
        return
    }

    // Known errors
    if (err instanceof Error) {
        let status = 400
        let message = err.message

        if (err.message.includes('not found')) {
            status = 404
        } else if (err.message.includes('unauthorized')) {
            status = 401
        } else if (err.message.includes('forbidden')) {
            status = 403
        } else if (err.message.includes('already exists')) {
            status = 409
        }

        res.status(status).json({
            success: false,
            status,
            error: message
        })
        return
    }

    // Unknown errors
    res.status(500).json({
        success: false,
        status: 500,
        error: 'Internal Server Error'
    })
}` 