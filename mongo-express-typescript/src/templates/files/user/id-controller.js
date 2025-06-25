export default `import type { Request, Response, NextFunction } from 'express'
import { {{MODEL}}Service } from "@modules/{{MODEL_LC}}/{{MODEL_LC}}.service"

export async function GET(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const result = await {{MODEL}}Service.get{{MODEL}}ById({ id })
        res.status(result.status).json(result)
    } catch (error) {
        next(error)
    }
}

export async function PUT(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const result = await {{MODEL}}Service.update{{MODEL}}({ id }, req.body)
        res.status(result.status).json(result)
    } catch (error) {
        next(error)
    }
}

export async function DELETE(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const result = await {{MODEL}}Service.delete{{MODEL}}({ id })
        res.status(result.status).json(result)
    } catch (error) {
        next(error)
    }
}` 