import fs from 'fs-extra'
import path from 'path'
import { templates } from '../../../providers/mongoets/index.js'
import { execSync } from 'child_process'
import chalk from 'chalk'

export async function createProjectFiles(targetDir, answers) {
    // Create project directory & structure
    await fs.ensureDir(targetDir)
    await fs.ensureDir(path.join(targetDir, 'src'))
    await fs.ensureDir(path.join(targetDir, 'src/routes'))
    await fs.ensureDir(path.join(targetDir, 'src/config'))

    // Initialize bun project with -y flag
    console.log(chalk.blue('\n📦 Initializing Bun project...\n'))
    execSync('bun init -y', {
        stdio: 'inherit',
        cwd: targetDir
    })

    // Write all template files
    await writeEnvFiles(targetDir, answers)
    await writeSourceFiles(targetDir, answers)
}

async function writeEnvFiles(targetDir, answers) {
    await fs.writeFile(
        path.join(targetDir, '.env'),
        `# MongoDB Configuration
MONGODB_URI=${answers.mongoUri}

# JWT Configuration
JWT_SECRET=FLESJSECRET

# App Configuration
PORT=3000`
    )

    await fs.writeFile(
        path.join(targetDir, '.env.example'),
        `# MongoDB Configuration
MONGODB_URI=

# JWT Configuration
JWT_SECRET=

# App Configuration
PORT=`
    )

    await fs.writeFile(
        path.join(targetDir, '.gitignore'),
        templates.gitignore + '\n.env\n'
    )
}

async function writeSourceFiles(targetDir, answers) {
    await fs.writeFile(
        path.join(targetDir, 'index.ts'),
        templates.rootIndex
    )

    await fs.writeFile(
        path.join(targetDir, 'src/errorHandler.ts'),
        templates.errorHandler
    )

    await fs.writeFile(
        path.join(targetDir, 'src/routes/controller.ts'),
        templates.homeController
    )

    await fs.writeFile(
        path.join(targetDir, 'src/config/mongodb.ts'),
        templates.mongodbConfig
    )

    await fs.writeFile(
        path.join(targetDir, 'src/config/mongodb.json'),
        templates.mongodbJson(answers.mongoUri, answers.dbName)
    )
}

export async function updatePackageJson(targetDir, pkgManager) {
    const pkgPath = path.join(targetDir, 'package.json')
    const pkg = JSON.parse(await fs.readFile(pkgPath))
    pkg.scripts = pkgManager === 'bun' ? {
        "start": "bun run index.ts",
        "dev": "bun --watch index.ts",
        "seed": "bun src/seeders/index.ts"
    } : {
        "start": "ts-node index.ts",
        "dev": "nodemon index.ts",
        "seed": "ts-node src/seeders/index.ts"
    }
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 4))
} 