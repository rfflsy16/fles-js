import fs from 'fs-extra'
import { templates } from '../../../providers/mongoets/index.js'

export async function generateModuleFiles(MODEL, MODEL_LC, MODEL_PLURAL, MODEL_LC_PLURAL, schemaFields) {
    const files = {
        [`${MODEL_LC}.repository.ts`]: MODEL === 'User' ? templates.userRepository : templates.repository,
        [`${MODEL_LC}.schema.ts`]: templates.schema,
        [`${MODEL_LC}.service.ts`]: MODEL === 'User' ? templates.userService : templates.service
    }

    for (const [filename, template] of Object.entries(files)) {
        await fs.writeFile(
            `./src/modules/${MODEL_LC}/${filename}`,
            template
                .replace(/{{MODEL}}/g, MODEL)
                .replace(/{{MODEL_LC}}/g, MODEL_LC)
                .replace(/{{MODEL_PLURAL}}/g, MODEL_PLURAL)
                .replace(/{{MODEL_LC_PLURAL}}/g, MODEL_LC_PLURAL)
                .replace(/{{FIELDS}}/g, schemaFields)
        )
    }

    await generateRouteFiles(MODEL, MODEL_LC, MODEL_PLURAL, MODEL_LC_PLURAL)
}

async function generateRouteFiles(MODEL, MODEL_LC, MODEL_PLURAL, MODEL_LC_PLURAL) {
    await fs.writeFile(
        `./src/routes/${MODEL_LC_PLURAL}/controller.ts`,
        (MODEL === 'User' ? templates.userController : templates.routeController(MODEL, MODEL_PLURAL, MODEL_LC_PLURAL))
            .replace(/{{MODEL}}/g, MODEL)
            .replace(/{{MODEL_LC}}/g, MODEL_LC)
            .replace(/{{MODEL_PLURAL}}/g, MODEL_PLURAL)
            .replace(/{{MODEL_LC_PLURAL}}/g, MODEL_LC_PLURAL)
    )

    await fs.writeFile(
        `./src/routes/${MODEL_LC_PLURAL}/[id]/controller.ts`,
        (MODEL === 'User' ? templates.userIdController : templates.routeIdController(MODEL))
            .replace(/{{MODEL}}/g, MODEL)
            .replace(/{{MODEL_LC}}/g, MODEL_LC)
    )
} 