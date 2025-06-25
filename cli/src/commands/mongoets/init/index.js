import inquirer from 'inquirer'
import fs from 'fs-extra'
import path from 'path'
import chalk from 'chalk'
import { checkPackageManager, installDependencies } from './packageManager.js'
import { createProjectFiles, updatePackageJson } from './projectFiles.js'
import { updateTsConfig } from './tsConfig.js'

export async function initMongoets(projectName = '.') {
    try {
        // Check package manager first
        const pkgManager = checkPackageManager()

        // Handle current directory
        const targetDir = projectName === '.' ? process.cwd() : path.join(process.cwd(), projectName)
        const projectDir = path.basename(targetDir)

        // Check if directory exists
        if (projectName !== '.' && fs.existsSync(targetDir)) {
            console.error(`❌ Directory ${projectName} already exists`)
            process.exit(1)
        }

        // Ask mongoets specific questions
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'mongoUri',
                message: '🔌 MongoDB URI:',
                default: 'mongodb://localhost:27017'
            },
            {
                type: 'input',
                name: 'dbName',
                message: '💾 Database name:',
                default: projectDir.replace(/-/g, '_')
            }
        ])

        // Create project files
        await createProjectFiles(targetDir, answers)

        // Install dependencies
        console.log(chalk.blue('\n📥 Installing dependencies...\n'))
        await installDependencies(pkgManager, targetDir)

        // Update package.json
        await updatePackageJson(targetDir, pkgManager)

        // Update tsconfig.json with path aliases
        await updateTsConfig(targetDir)

        console.log(chalk.bold.greenBright('\n✨ Project Created Successfully! ✨\n'))

        console.log(`
${chalk.bold.greenBright('🚀 Next steps:')}
  ${chalk.yellowBright(`cd ${projectName !== '.' ? projectName : ''}`)}
  ${chalk.yellowBright('bun run dev')}
`)
    } catch (error) {
        console.error(chalk.red('\n❌ Error:', error.message))
        process.exit(1)
    }
} 