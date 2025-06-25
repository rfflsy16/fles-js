import fs from 'fs-extra'
import { templates } from 'fles-mongo-express'
import chalk from 'chalk'
import { showError, showInfo, showSuccess } from '../shared/messages.js'

function parseFields(args) {
    if (!args || args.length === 0) {
        throw new Error('Please provide fields (e.g., name:string age:number)')
    }

    return args.reduce((acc, field) => {
        const [name, type] = field.split(':')
        if (!name || !type) {
            throw new Error(`Invalid field format: ${field}. Use format: name:type`)
        }
        acc[name] = type.toLowerCase()
        return acc
    }, {})
}

async function generateModelFile(name, fields) {
    const modelContent = templates.model
        .replace(/MODELNAME/g, name)
        .replace(/COLLECTION/, name.toLowerCase())
        .replace(/FIELDS/, Object.entries(fields)
            .map(([name, type]) => `        ${name}: { type: '${type}' }`)
            .join(',\n'))

    await fs.writeFile(
        `./models/${name.toLowerCase()}.js`,
        modelContent
    )
}

async function generateControllerFile(name) {
    const controllerContent = templates.controller
        .replace(/MODELNAME/g, name)

    await fs.writeFile(
        `./controllers/${name.toLowerCase()}.js`,
        controllerContent
    )
}

async function generateRouterFile(name) {
    const routerContent = templates.router
        .replace(/MODELNAME/g, name)

    await fs.writeFile(
        `./routers/${name.toLowerCase()}Router.js`,
        routerContent
    )
}

async function generateSeederFile(name, fields) {
    // Create directories
    await fs.ensureDir('./seeders')
    await fs.ensureDir('./data')
    
    // Generate seeder
    const seederContent = templates.seeder
        .replace(/MODELNAME/g, name)
        .replace(/COLLECTION/g, name.toLowerCase())
    
    await fs.writeFile(
        `./seeders/${name.toLowerCase()}Seeder.js`,
        seederContent
    )
    
    // Generate sample data
    const sampleFields = Object.entries(fields).reduce((acc, [field, type]) => {
        let value;
        switch(type) {
            case 'number':
            case 'float':
                value = 99.99;
                break;
            case 'integer':
                value = 42;
                break;
            case 'boolean':
                value = true;
                break;
            case 'date':
                value = new Date();
                break;
            case 'json':
                value = { key: 'value' };
                break;
            default:
                value = `Sample ${field}`;
        }
        return { ...acc, [field]: value };
    }, {})
    
    const sampleData = [{
        _id: "000000000000000000000001",
        ...sampleFields,
        createdAt: new Date(),
        updatedAt: new Date()
    }]
    
    await fs.writeFile(
        `./data/${name.toLowerCase()}.json`,
        JSON.stringify(sampleData, null, 4)
    )
    
    // Update seeders/index.js
    const indexPath = './seeders/index.js'
    if (!fs.existsSync(indexPath)) {
        await fs.writeFile(indexPath, templates.seederIndex)
    }
    
    let content = await fs.readFile(indexPath, 'utf-8')
    content = content.replace(
        '// {{seeders}}',
        `// {{seeders}}\n    (await import('./${name.toLowerCase()}Seeder.js')).default,`
    )
    await fs.writeFile(indexPath, content)
}

async function updateModelIndex(name) {
    const indexPath = './models/index.js'
    if (!fs.existsSync(indexPath)) {
        await fs.writeFile(indexPath, templates.modelIndex)
    }
    
    let content = await fs.readFile(indexPath, 'utf-8')
    content = content.replace(
        '// {{exports}}', 
        `export { ${name} } from './${name.toLowerCase()}.js'\n// {{exports}}`
    )
    await fs.writeFile(indexPath, content)
}

async function updateControllerIndex(name) {
    const indexPath = './controllers/index.js'
    
    // Create if not exists
    if (!fs.existsSync(indexPath)) {
        await fs.writeFile(indexPath, templates.controllerIndex)
    }
    
    let content = await fs.readFile(indexPath, 'utf-8')
    content = content.replace(
        '// {{exports}}',
        `export { ${name}Controller } from './${name.toLowerCase()}.js'\n// {{exports}}`
    )
    await fs.writeFile(indexPath, content)
}

async function updateRouterIndex(name) {
    const indexPath = './routers/index.js'
    if (!fs.existsSync(indexPath)) {
        await fs.writeFile(indexPath, templates.routerIndex)
    }
    
    let content = await fs.readFile(indexPath, 'utf-8')
    content = content.replace(
        '// {{routers}}',
        `import ${name.toLowerCase()}Router from './${name.toLowerCase()}Router.js'\n// {{routers}}\nrouter.use('/${name.toLowerCase()}s', ${name.toLowerCase()}Router)`
    )
    await fs.writeFile(indexPath, content)
}

async function updateRootIndex(name) {
    const indexPath = './index.js'
    let content = await fs.readFile(indexPath, 'utf-8')
    
    const newRouteBlock = `
    ▰▱▰▱▰▱▰▱▰▱▰▱▰▱ ${chalk.cyan.bold(name)} ▰▱▰▱▰▱▰▱▰▱▰▱▰▱
    
    ${chalk.green('GET')}     ${chalk.white('/api/' + name.toLowerCase() + 's')}          ${chalk.gray('Get all ' + name.toLowerCase() + 's')}
    ${chalk.green('GET')}     ${chalk.white('/api/' + name.toLowerCase() + 's/:id')}      ${chalk.gray('Get one ' + name.toLowerCase())}
    ${chalk.blue('POST')}    ${chalk.white('/api/' + name.toLowerCase() + 's')}          ${chalk.gray('Create new ' + name.toLowerCase())}
    ${chalk.yellow('PUT')}     ${chalk.white('/api/' + name.toLowerCase() + 's/:id')}      ${chalk.gray('Update ' + name.toLowerCase())}
    ${chalk.red('DELETE')}  ${chalk.white('/api/' + name.toLowerCase() + 's/:id')}      ${chalk.gray('Delete ' + name.toLowerCase())}
`

    // Extract existing routes if any
    let existingRoutes = ''
    const routesMatch = content.match(/📦 Available Routes:([\s\S]*?)(?=\`)/)
    if (routesMatch) {
        existingRoutes = routesMatch[1]
    }

    const routes = `
    // Print routes info after server ready
    setTimeout(() => {
        console.log(\`
${chalk.magenta.bold('📦 Available Routes:')}
${existingRoutes}${newRouteBlock}\`)
    }, 100)`

    // Replace existing setTimeout or add new one
    if (content.includes('setTimeout')) {
        const routesRegex = /setTimeout\(\(\) => \{[\s\S]*?\}, 100\)/
        content = content.replace(routesRegex, routes.trim())
    } else {
        const lastIndex = content.lastIndexOf('// Print routes info')
        if (lastIndex !== -1) {
            content = content.slice(0, lastIndex) + routes + '\n\n' + content.slice(lastIndex)
        } else {
            content += routes
        }
    }
    
    await fs.writeFile(indexPath, content)
}

export async function generateModel(name, args) {
    try {
        if (!name) {
            throw new Error('Please provide a model name')
        }

        // Capitalize first letter
        name = name.charAt(0).toUpperCase() + name.slice(1)
        
        // Check if files already exist
        const modelPath = `./models/${name.toLowerCase()}.js`
        const controllerPath = `./controllers/${name.toLowerCase()}.js`
        const routerPath = `./routers/${name.toLowerCase()}Router.js`
        
        if (fs.existsSync(modelPath) || fs.existsSync(controllerPath) || fs.existsSync(routerPath)) {
            throw new Error(`${name} model/controller/router already exists`)
        }

        showInfo(`Generating ${name} model, controller & router...`)
        
        const fields = parseFields(args)
        
        // Generate files
        await generateModelFile(name, fields)
        await generateControllerFile(name)
        await generateRouterFile(name)
        await generateSeederFile(name, fields)
        await updateModelIndex(name)
        await updateControllerIndex(name)
        await updateRouterIndex(name)
        await updateRootIndex(name)

        showSuccess(`
✨ Generated successfully:
- models/${name.toLowerCase()}.js
- controllers/${name.toLowerCase()}.js
- routers/${name.toLowerCase()}Router.js
- seeders/${name.toLowerCase()}Seeder.js
- data/${name.toLowerCase()}.json
- Updated models/index.js
- Updated controllers/index.js
- Updated routers/index.js
- Updated seeders/index.js
- Updated index.js with routes info

${name === 'User' ? '💡 TIP: Don\'t forget to setup authentication in middlewares/auth.js\n' : ''}
        `)

    } catch (error) {
        showError(error, 'model generation')
        process.exit(1)
    }
}
