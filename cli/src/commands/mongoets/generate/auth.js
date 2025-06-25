import fs from 'fs-extra'
import { templates } from '../../../providers/mongoets/index.js'

export async function generateAuthFiles(MODEL, MODEL_LC) {
    await fs.ensureDir('./src/utils')
    await fs.ensureDir('./src/routes/auth/sessions')
    await fs.ensureDir('./src/routes/auth/register')
    
    await fs.writeFile('./src/utils/bcrypt.ts', templates.bcryptUtil)
    await fs.writeFile('./src/utils/jwt.ts', templates.jwtUtil)
    
    await fs.writeFile(
        './src/routes/auth/sessions/controller.ts',
        templates.userSessionsController
            .replace(/{{MODEL}}/g, MODEL)
            .replace(/{{MODEL_LC}}/g, MODEL_LC)
    )

    await fs.writeFile(
        './src/routes/auth/register/controller.ts',
        templates.userRegisterController
            .replace(/{{MODEL}}/g, MODEL)
            .replace(/{{MODEL_LC}}/g, MODEL_LC)
    )

    await fs.writeFile(
        `./src/modules/${MODEL_LC}/auth.service.ts`,
        templates.userAuthService
            .replace(/{{MODEL}}/g, MODEL)
            .replace(/{{MODEL_LC}}/g, MODEL_LC)
    )
} 