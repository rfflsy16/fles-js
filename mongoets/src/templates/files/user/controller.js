export default `import type { Request, Response, NextFunction } from 'express'
import { {{MODEL}}Service } from "@modules/{{MODEL_LC}}/{{MODEL_LC}}.service"

export async function GET(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await {{MODEL}}Service.getAll{{MODEL}}s()
        res.status(result.status).json(result)
    } catch (error) {
        next(error)
    }
}

// Create user (admin only)
export async function POST(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await {{MODEL}}Service.create{{MODEL}}(req.body)
        res.status(result.status).json(result)
    } catch (error) {
        next(error)
    }
}` 