import fs from 'fs-extra'
import { showError, showInfo, showSuccess } from '../../shared/messages.js'
import { getPlural } from '../../../utils/plural.js'
import { generateSeederFile } from './seeder.js'
import { generateAuthFiles } from './auth.js'
import { generateModuleFiles } from './module.js'
import { parseFields } from '../../../utils/zodTypes.js'

export async function generateModel(name, args) {
    try {
        if (!name) {
            throw new Error('Please provide a model name')
        }

        const MODEL = name.charAt(0).toUpperCase() + name.slice(1)
        const MODEL_LC = MODEL.toLowerCase()
        const MODEL_PLURAL = getPlural(MODEL)
        const MODEL_LC_PLURAL = MODEL_PLURAL.toLowerCase()
        
        // Create directories
        await fs.ensureDir('./src/modules')
        await fs.ensureDir('./src/routes')
        await fs.ensureDir(`./src/modules/${MODEL_LC}`)
        await fs.ensureDir(`./src/routes/${MODEL_LC_PLURAL}`)
        await fs.ensureDir(`./src/routes/${MODEL_LC_PLURAL}/[id]`)

        showInfo(`Generating ${MODEL} module...`)
        
        const fields = parseFields(args)
        
        // Check if User model with auth
        const isAuthUser = name === 'User' && 
            Object.entries(fields).some(([name]) => name === 'email') && 
            Object.entries(fields).some(([name]) => name === 'password')

        // Generate schema fields
        const schemaFields = Object.entries(fields)
            .map(([name, type]) => `    ${name}: ${type}`)
            .join(',\n')

        // Generate auth files if needed
        if (isAuthUser) {
            await generateAuthFiles(MODEL, MODEL_LC)
        }

        // Generate module files
        await generateModuleFiles(MODEL, MODEL_LC, MODEL_PLURAL, MODEL_LC_PLURAL, schemaFields)

        // Generate seeder files
        await generateSeederFile(MODEL, fields, MODEL_PLURAL, MODEL_LC_PLURAL)

        showSuccess(`
✨ Generated successfully:
${isAuthUser ? `- src/utils/bcrypt.ts
- src/utils/jwt.ts
- src/routes/auth/sessions/controller.ts
- src/routes/auth/register/controller.ts` : ''}
- src/modules/${MODEL_LC}/${MODEL_LC}.repository.ts
- src/modules/${MODEL_LC}/${MODEL_LC}.schema.ts  
- src/modules/${MODEL_LC}/${MODEL_LC}.service.ts
- src/routes/${MODEL_LC_PLURAL}/controller.ts
- src/routes/${MODEL_LC_PLURAL}/[id]/controller.ts
- src/seeders/${MODEL_LC}Seeder.ts
- src/data/${MODEL_LC_PLURAL}.json
- Updated src/seeders/index.ts

💡 TIP: Run 'bun run seed' to seed your database with sample data!
        `)

    } catch (error) {
        showError(error, 'model generation')
        process.exit(1)
    }
} 