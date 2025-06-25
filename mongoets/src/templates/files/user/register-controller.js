export default `import type { Request, Response, NextFunction } from 'express'
import { Auth{{MODEL}}Service } from "@modules/{{MODEL_LC}}/auth.service"

export async function POST(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await Auth{{MODEL}}Service.register(req.body)
        res.status(result.status).json(result)
    } catch (error) {
        next(error)
    }
}` 