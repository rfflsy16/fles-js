import inquirer from 'inquirer'
import fs from 'fs-extra'
import { templates } from 'fles-mongo-express'
import path from 'path'
import { execSync } from 'child_process'
import chalk from 'chalk'

export async function initMongoejs(projectName = '.') {
    // Handle current directory
    const targetDir = projectName === '.' ? process.cwd() : path.join(process.cwd(), projectName)
    const projectDir = path.basename(targetDir)

    // Check if directory exists
    if (projectName !== '.' && fs.existsSync(targetDir)) {
        console.error(`❌ Directory ${projectName} already exists`)
        process.exit(1)
    }

    // Ask mongoejs specific questions
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

    // Create config
    const config = {
        development: {
            uri: answers.mongoUri,
            name: `${answers.dbName}_dev`
        },
        test: {
            uri: answers.mongoUri,
            name: `${answers.dbName}_test`
        },
        production: {
            uri: answers.mongoUri,
            name: `${answers.dbName}_prod`
        }
    }

    // Create project structure
    const basePath = projectName === '.' ? '.' : projectName

    console.log(chalk.blue('\n📦 Creating project structure...\n'))

    await fs.ensureDir(basePath)
    await fs.ensureDir(path.join(basePath, 'models'))
    await fs.ensureDir(path.join(basePath, 'controllers'))
    await fs.ensureDir(path.join(basePath, 'routers'))
    await fs.ensureDir(path.join(basePath, 'middlewares'))
    await fs.ensureDir(path.join(basePath, 'config'))
    await fs.ensureDir(path.join(basePath, 'seeders'))
    await fs.ensureDir(path.join(basePath, 'data'))

    // Initialize package.json
    console.log(chalk.blue('📝 Initializing package.json...'))
    execSync('npm init -y', {
        stdio: 'inherit',
        cwd: basePath
    })

    // Install dependencies
    console.log(chalk.blue('\n📥 Installing dependencies...\n'))
    try {
        // Install other deps first
        execSync('npm install mongodb express cors dotenv', {
            stdio: 'inherit',
            cwd: basePath
        })

        try {
            execSync('npm install fles-mongo-express', {
                stdio: 'inherit',
                cwd: basePath
            })
        } catch (e) {
            // If not published yet, use npm link
            console.log(chalk.yellow('\n⚠️ Using local fles-mongo-express...\n'))
            execSync('npm link fles-mongo-express', {
                stdio: 'inherit',
                cwd: basePath
            })
        }
    } catch (error) {
        console.error(chalk.red('\n❌ Error installing dependencies:', error.message))
        process.exit(1)
    }

    // Write files
    await fs.writeFile(
        path.join(basePath, 'config/mongodb.json'),
        JSON.stringify(config, null, 4)
    )

    // Copy template files
    await fs.writeFile(
        path.join(basePath, 'models/index.js'),
        templates.modelIndex
    )
    await fs.writeFile(
        path.join(basePath, 'routers/index.js'),
        templates.routerIndex
    )
    await fs.writeFile(
        path.join(basePath, 'middlewares/auth.js'),
        templates.auth
    )
    await fs.writeFile(
        path.join(basePath, 'middlewares/errorHandler.js'),
        templates.errorHandler
    )
    await fs.writeFile(
        path.join(basePath, 'index.js'),
        templates.rootIndex
    )



    // Update package.json scripts
    const pkgPath = path.join(basePath, 'package.json')
    const pkg = JSON.parse(await fs.readFile(pkgPath))
    pkg.scripts = {
        "start": "node index.js",
        "dev": "node --watch index.js",
        "seed": "node seeders/index.js down && node seeders/index.js up",
        "seed:up": "node seeders/index.js up",
        "seed:down": "node seeders/index.js down"
    }
    pkg.type = "module"
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 4))

    console.log(chalk.bold.greenBright('\n✨ Project Created Successfully! ✨\n'))

    console.log(`
📁 ${chalk.bold.blueBright(projectDir)}/
    ${chalk.magenta('├─')} ${chalk.cyan('models/')}
    ${chalk.magenta('├─')} ${chalk.cyan('controllers/')}
    ${chalk.magenta('├─')} ${chalk.cyan('routers/')}
    ${chalk.magenta('├─')} ${chalk.cyan('middlewares/')}
    ${chalk.magenta('├─')} ${chalk.cyan('config/')}
    ${chalk.magenta('│  └─')} ${chalk.cyan('mongodb.json')} ${chalk.gray(`(${config.development.name})`)}
    ${chalk.magenta('├─')} ${chalk.cyan('seeders/')}
    ${chalk.magenta('└─')} ${chalk.cyan('data/')}
`)

    console.log(`
${chalk.bold.greenBright('🚀 Next steps:')}
    ${chalk.yellowBright(`cd ${projectName !== '.' ? projectName : ''}`)}
    ${chalk.yellowBright('npm run dev')}
`)

    console.log(`
${chalk.bold.greenBright('💾 Database Commands:')}
    ${chalk.yellowBright('npm run seed')}      ${chalk.gray('# Reset & seed database')}
    ${chalk.yellowBright('npm run seed:up')}   ${chalk.gray('# Only seed database')}
    ${chalk.yellowBright('npm run seed:down')} ${chalk.gray('# Only clear database')}
    `)
}
