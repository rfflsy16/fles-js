export const routeController = (MODEL, MODEL_PLURAL, MODEL_LC_PLURAL) => `import type { Request, Response, NextFunction } from 'express'
import { ${MODEL}Service } from "@modules/${MODEL.toLowerCase()}/${MODEL.toLowerCase()}.service"

export async function GET(req: Request, res: Response, next: NextFunction) {
    try {
        const ${MODEL_LC_PLURAL} = await ${MODEL}Service.getAll${MODEL_PLURAL}()
        res.status(${MODEL_LC_PLURAL}.status).json(${MODEL_LC_PLURAL})
    } catch (error) {
        next(error)
    }
}

export async function POST(req: Request, res: Response, next: NextFunction) {
    try {
        const ${MODEL.toLowerCase()} = await ${MODEL}Service.create${MODEL}(req.body)
        res.status(${MODEL.toLowerCase()}.status).json(${MODEL.toLowerCase()})
    } catch (error) {
        next(error)
    }
}`

export const routeIdController = (MODEL) => `import type { Request, Response, NextFunction } from 'express'
import { ${MODEL}Service } from "@modules/${MODEL.toLowerCase()}/${MODEL.toLowerCase()}.service"

export async function GET(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const ${MODEL.toLowerCase()} = await ${MODEL}Service.get${MODEL}ById({ id })
        res.status(${MODEL.toLowerCase()}.status).json(${MODEL.toLowerCase()})
    } catch (error) {
        next(error)
    }
}

export async function PUT(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const ${MODEL.toLowerCase()} = await ${MODEL}Service.update${MODEL}({ id }, req.body)
        res.status(${MODEL.toLowerCase()}.status).json(${MODEL.toLowerCase()})
    } catch (error) {
        next(error)
    }
}

export async function DELETE(req: Request, res: Response, next: NextFunction) {
    try {
        const { id } = req.params
        const ${MODEL.toLowerCase()} = await ${MODEL}Service.delete${MODEL}({ id })
        res.status(${MODEL.toLowerCase()}.status).json(${MODEL.toLowerCase()})
    } catch (error) {
        next(error)
    }
}` 