export default `import type { Request, Response } from 'express'

export async function GET(req: Request, res: Response) {
    res.json({ 
        message: \`Welcome to FLES-JS XROUTES\`,
    })
}` 