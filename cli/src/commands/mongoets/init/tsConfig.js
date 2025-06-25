import fs from 'fs-extra'
import path from 'path'
import { showError, showSuccess } from '../../shared/messages.js'

export async function updateTsConfig(projectDir) {
    try {
        const tsConfigPath = path.join(projectDir, 'tsconfig.json')
        
        // Check if file exists
        if (!fs.existsSync(tsConfigPath)) {
            throw new Error('tsconfig.json not found! Make sure bun init completed successfully.')
        }

        // Read file as string first
        const tsConfigStr = await fs.readFile(tsConfigPath, 'utf-8')
        
        // Remove comments before parsing
        const tsConfigCleaned = tsConfigStr.replace(/\\"|"(?:\\"|[^"])*"|(\/\/.*|\/\*[\s\S]*?\*\/)/g, (m, g) => g ? '' : m)
        
        const tsConfig = JSON.parse(tsConfigCleaned)

        // Tambah baseUrl & path alias
        tsConfig.compilerOptions = {
            ...(tsConfig.compilerOptions || {}),
            baseUrl: ".",
            paths: {
                "@/*": ["src/*"],
                "@modules/*": ["src/modules/*"],
                "@config/*": ["src/config/*"],
                "@utils/*": ["src/utils/*"]
            }
        }

        // Tulis balik ke file, TAPI preserve comments
        const updatedContent = tsConfigStr.replace(
            /"compilerOptions"\s*:\s*{([^}]*)}/,
            `"compilerOptions": {$1,
    // Path alias
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@modules/*": ["src/modules/*"],
      "@config/*": ["src/config/*"],
      "@utils/*": ["src/utils/*"]
    }
}`
        )

        await fs.writeFile(tsConfigPath, updatedContent)

        showSuccess('✨ Added path aliases to tsconfig.json')
    } catch (error) {
        showError(error, 'updating tsconfig.json')
    }
} 