import inquirer from 'inquirer'
import fs from 'fs-extra'
import { templates } from '@henscc/mongajs'
import path from 'path'
import { execSync } from 'child_process'
import chalk from 'chalk'

export async function initMongajs(projectName = '.') {
    // Handle current directory
    const targetDir = projectName === '.' ? process.cwd() : path.join(process.cwd(), projectName)
    const projectDir = path.basename(targetDir)

    // Check if directory exists
    if (projectName !== '.' && fs.existsSync(targetDir)) {
        console.error(`❌ Directory ${projectName} already exists`)
        process.exit(1)
    }

    // Ask mongajs specific questions
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
    await fs.ensureDir(path.join(basePath, 'schemas'))
    await fs.ensureDir(path.join(basePath, 'config'))
    await fs.ensureDir(path.join(basePath, 'seeders'))
    await fs.ensureDir(path.join(basePath, 'data'))

    // Initialize package.json
    console.log(chalk.blue('📝 Initializing package.json...'))
    execSync('npm init -y', { 
        stdio: 'inherit',
        cwd: basePath 
    })

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
        path.join(basePath, 'index.js'),
        templates.rootIndex
    )

    // Install dependencies
    console.log(chalk.blue('\n📥 Installing dependencies...\n'))
    execSync('npm install @henscc/mongajs mongodb @apollo/server graphql dotenv', {
        stdio: 'inherit',
        cwd: basePath
    })

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
  ${chalk.magenta('├─')} ${chalk.cyan('schemas/')}
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