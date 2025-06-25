export default `import type { Request, Response, NextFunction } from 'express'
import { Auth{{MODEL}}Service } from "@modules/{{MODEL_LC}}/auth.service"

export async function POST(req: Request, res: Response, next: NextFunction) {
    try {
        const { email, password } = req.body
        const result = await Auth{{MODEL}}Service.login(email, password)
        res.status(result.status).json(result)
    } catch (error) {
        next(error)
    }
}

export async function DELETE(req: Request, res: Response, next: NextFunction) {
    try {
        // Handle logout (invalidate token, clear cookie etc)
        res.status(200).json({
            success: true,
            message: "Logged out successfully"
        })
    } catch (error) {
        next(error)
    }
}` 